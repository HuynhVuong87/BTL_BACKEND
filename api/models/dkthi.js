const admin = require("firebase-admin");
const FirestoreService = require("../services/firestore");
const HelperService = require("../services/helper");
const db = admin.firestore();

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

exports.show_session_for_student = uid => {
    return new Promise((r, j) => {
        try {
            FirestoreService.get_one("users", uid).then(async user => {
                let in_courses = user.in_courses || [];
                in_courses = in_courses.filter(x => x.active);
                if (in_courses.length > 0) {
                    let data = [];
                    await asyncForEach(
                        in_courses.map(x => x.course_id),
                        async course_id => {
                            const course = await FirestoreService.get_one(
                                "Courses",
                                course_id
                            );
                            if (course.active && course.in_term) {
                                const term = await FirestoreService.get_one(
                                    "Terms",
                                    course.in_term.id
                                );
                                const now = HelperService.create_milisec();
                                if (term.active && term.from <= now && now <= term.to) {
                                    const sessions =
                                        term.courses.find(x => x.id == course_id).sessions || [];
                                    if (sessions.length > 0) {
                                        await asyncForEach(
                                            sessions.map(x => x.id),
                                            async sess_id => {
                                                const session = await FirestoreService.get_one(
                                                    "Sessions",
                                                    sess_id
                                                );
                                                const rooms = session.rooms || [];
                                                if (rooms.length > 0) {
                                                    rooms.forEach(room => {
                                                        data.push({
                                                            term: {
                                                                id: term.id,
                                                                name: term.name
                                                            },
                                                            course: {
                                                                id: course_id,
                                                                name: course.course_name,
                                                                code: course.course_code,
                                                                teacher: course.course_teacher,
                                                                of: course.course_of
                                                            },
                                                            session: {
                                                                id: session.id,
                                                                date: session.date,
                                                                from: session.from,
                                                                duration: session.duration,
                                                                name: session.name
                                                            },
                                                            room: {
                                                                id: room.id,
                                                                room_num: room.room_num,
                                                                length: room["length"],
                                                                place: room.place
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    );
                    r(data);
                } else {
                    r([]);
                }
            });
        } catch (err) {
            console.log(err);
            j(err);
        }
    });
};

exports.booked_room = (body, out) => {
    console.log(out);
    return new Promise(async (r, j) => {
        const batch = db.batch();
        const room = await FirestoreService.get_one("Rooms", body.room_id);
        room.booked = room.booked || 0;
        room.students_uid = room.students_uid || [];
        if (!out && room.students_uid.length == room.length) {
            j("Phòng thi này đã hết máy trống, vui lòng kiểm tra lại");
        } else {
            const course = await FirestoreService.get_one("Courses", body.course_id);
            const student = await FirestoreService.get_one("users", body.uid);
            course.students = course.students || [];
            const check = course.students.find(x => x.mssv === student.mssv);
            if (check) {
                if (check.active) {
                    if (!check.booked) {
                        if (!room.students_uid.includes(body.uid)) {
                            room.students_uid.push(body.uid);
                            const roomRef = db.collection("Rooms").doc(body.room_id);
                            batch.update(roomRef, {
                                students_uid: room.students_uid
                            });
                            course.students[course.students.findIndex(x => x.mssv === student.mssv)].booked = true;
                            const courseRef = db.collection("Courses").doc(body.course_id);
                            batch.update(courseRef, {
                                students: course.students
                            });
                            batch.commit().then(() => r()).catch(err => j(err))
                        } else {
                            j(
                                "Bạn đã nằm trong danh sách sinh viên đăng kí thi tại phòng thi này rồi"
                            );
                        }
                    } else if (out) {
                        console.log('loai bo');
                        room.students_uid.splice(room.students_uid.indexOf(body.uid),1);
                        const roomRef = db.collection("Rooms").doc(body.room_id);
                        batch.update(roomRef, {
                            students_uid: room.students_uid
                        });
                        course.students[course.students.findIndex(x => x.mssv === student.mssv)].booked = false;
                        const courseRef = db.collection("Courses").doc(body.course_id);
                        batch.update(courseRef, {
                            students: course.students
                        });
                        batch.commit().then(() => r()).catch(err => j(err))
                    } else {
                        j("Bạn đã đặt chỗ cho môn thi này rồi");
                    }
                } else {
                    j("Bạn không được phép đăng kí môn thi này.");
                }
            } else {
                j("Môn học này không có sinh viên.");
            }
        }
    });
};