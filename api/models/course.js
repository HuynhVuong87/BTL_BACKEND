const firestoreService = require("../services/firestore");
const admin = require('firebase-admin');
const helperService = require('../services/helper');

const db = admin.firestore();

exports.get_all_courses = () => {
    return new Promise((r, j) => {
        firestoreService
            .get_all_data_from_col("Courses")
            .then(data => {
                r(data);
            })
            .catch(err => j(err));
    });
};

exports.get_all_courses_with_field = (field) => {
    return new Promise((r, j) => {
        db.collection('Courses').where('active', '==', true).select(field, 'course_code').get().then(docs => {
            let datas = [];
            docs.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                datas.push(data)
            })
            r(datas);
        }).catch(err => {
            j(err);
        });
    });
};

exports.get_one_course = doc => {
    return new Promise((r, j) => {
        firestoreService
            .get_one("Courses", doc)
            .then(data => {
                r(data);
            })
            .catch(err => j(err));
    });
};

exports.set_one_course = val => {
    val.active = true;
    return new Promise((r, j) => {
        firestoreService
            .set_one("Courses", val)
            .then(() => {
                r();
            })
            .catch(err => j(err));
    });
};

exports.update_one_course = (doc, val) => {
    return new Promise((r, j) => {
        firestoreService
            .update_one("Courses", doc, val)
            .then(() => {
                r();
            })
            .catch(err => j(err));
    });
};
exports.add_students_for_course = (course_id, valForUpdate) => {
    return new Promise(async (r, j) => {
        try {
            const course = await firestoreService.get_one('Courses', course_id);
            const batch = db.batch();
            let students = course.students || [];
            let merged = helperService.merge(valForUpdate, students);
            const courseRef = db.collection('Courses').doc(course_id);
            batch.update(courseRef, {
                students: merged
            })
            await asyncForEach(valForUpdate, async user => {
                const dataUser = await firestoreService.get_one_by_field('users', 'mssv', user.mssv);
                let user_courses = dataUser.in_courses || [];
                let index = user_courses.findIndex(x => x.course_id == course_id);
                if (index == -1) {
                    user_courses.push({
                        course_id: course_id,
                        active: user.active
                    });
                } else {
                    user_courses[index].active = user.active;
                }
                const userRef = db.collection('users').doc(dataUser.id);
                batch.update(userRef, {
                    in_courses: user_courses
                });
            })
            batch.commit().then(() => r()).catch(err => j(err))
        } catch (error) {
            j(error)
        }

    })
}


exports.set_term_for_courses = (body) => {
    return new Promise(async (r, j) => {
        var batch = db.batch();
        await firestoreService
            .get_one("Terms", body.term.id)
            .then(data => {
                let coursesInTerm = data.courses || [];
                let merged = helperService.merge(body.courses, coursesInTerm);
                let termRef = db.collection('Terms').doc(body.term.id);
                batch.update(termRef, {
                    courses: merged,
                    mtime: helperService.create_milisec()
                });
                body.courses.forEach(val => {
                    let courseRef = db.collection('Courses').doc(val.id);
                    batch.update(courseRef, {
                        in_term: body.term,
                        mtime: helperService.create_milisec()
                    })
                })
                batch.commit().then(() => r()).catch(err => j(err))
            })
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}