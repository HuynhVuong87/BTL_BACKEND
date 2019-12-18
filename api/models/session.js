const admin = require("firebase-admin");
const helperServices = require("../services/helper");
const firestoreServices = require("../services/firestore");

const db = admin.firestore();

exports.set_one_session = body => {
    return new Promise(async (r, j) => {
        try {
            var batch = db.batch();

            await firestoreServices.get_one("Terms", body.term_id).then(data => {
                data.courses = data.courses || [];
                if (data.courses) {
                    body.selected.forEach(val => {
                        let sessionRef = db.collection("Sessions").doc();
                        let session_id = sessionRef.id;

                        let sessions = data.courses.find(x => x.id === val.id).sessions;
                        sessions = sessions || [];
                        if (
                            sessions.findIndex(x => x.date == body.date) == -1 &&
                            sessions.findIndex(x => x.from == body.from) == -1
                        ) {
                            batch.set(
                                sessionRef, {
                                    name: body.name,
                                    date: body.date,
                                    from: body.from,
                                    duration: body.duration,
                                    term_id: body.term_id,
                                    of_course: val.id
                                }, {
                                    merge: true
                                }
                            );

                            sessions.push({
                                id: session_id,
                                date: body.date,
                                from: body.from,
                                name: body.name,
                                duration: body.duration
                            });
                        } else {
                            j(
                                "Thời gian ca thi đã tồn tại trong học phần , vui lòng kiểm tra lại"
                            );
                        }
                        data.courses.find(x => x.id === val.id).sessions = sessions;
                    });
                }
                let termRef = db.collection("Terms").doc(body.term_id);
                batch.update(termRef, {
                    courses: data.courses
                });

                batch.commit().then(() => {
                    r(data.courses);
                });
            });
        } catch (error) {

            j(error);
        }
    });
};

exports.remove_multi_session_of_course = body => {
    return new Promise((r, j) => {
        try {

            firestoreServices.get_one("Terms", body.term_id).then(termData => {
                let sessions = termData.courses.find(x => x.id == body.course_id)
                    .sessions;
                body.session_to_remove.forEach(val => {
                    sessions.splice(
                        sessions.findIndex(x => x.id == val),
                        1
                    );
                });
                termData.courses.find(x => x.id == body.course_id).sessions = sessions;

                firestoreServices
                    .update_one("Terms", body.term_id, {
                        courses: termData.courses
                    })
                    .then(() => r(sessions));
            });
        } catch (error) {
            j(error);
        }
    });
};

exports.get_one_session = id => {
    return new Promise(async (r, j) => {
        try {
            const session = await firestoreServices.get_one("Sessions", id);
            // session.rooms = session.rooms || []
            // await asyncForEach(session.rooms.map(x=>x.id), async room_id => {
            //     const room = await firestoreServices.get_one('Rooms', room_id);
            //     session.rooms[session.rooms.findIndex(x=>x.id === room_id)].booked = room.students_uid? room.students_uid.length : 0
            // })
            r(session)
        } catch (error) {
            j(error);
        }
    });
};

exports.modify_room_in_session = body => {
    return new Promise((r, j) => {
        try {
            if (body.room_num !== null && body.place.length > 0 && body.length > 0) {
                body.place = body.place.toString().toUpperCase();
                firestoreServices.get_one("Sessions", body.session_id).then(data => {
                    const batch = db.batch();
                    const sessionRef = db.collection("Sessions").doc(body.session_id);
                    let rooms = data.rooms || [];
                    const index = rooms.findIndex(x => x.id === body.id);
                    switch (body.mode) {
                        case "add":
                            if (
                                rooms.findIndex(
                                    x => x.place.toLowerCase() === body.place.toLowerCase()
                                ) == -1 &&
                                rooms.findIndex(
                                    x => x.place.toLowerCase() === body.place.toLowerCase()
                                ) == -1
                            ) {
                                console.log(body);
                                const roomRef = db.collection('Rooms').doc();
                                delete body.mode;
                                batch.set(roomRef, body, {
                                    merge: true
                                });
                                body.id = roomRef.id;
                                rooms.push(body);
                                batch.update(sessionRef, {
                                    rooms: rooms
                                })
                                batch.commit().then(() => r())
                            } else {
                                j("Phòng thi bạn thêm đã tồn tại trong ca thi này");
                            }
                            break;
                        case "edit":
                            const roomRef = db.collection('Rooms').doc(body.id);
                            delete body.mode;
                            batch.set(roomRef, body, {
                                merge: true
                            });
                            body.id = roomRef.id;
                            rooms[index] = body;
                            batch.update(sessionRef, {
                                rooms: rooms
                            });
                            batch.commit().then(() => r());

                            break;
                        case "delete":
                            const roomRefd = db.collection('Rooms').doc(body.id);
                            rooms.splice(index, 1);
                            batch.delete(roomRefd);
                            batch.update(sessionRef, {
                                rooms: rooms
                            });
                            batch.commit().then(() => r())
                            break;
                    }
                });
            } else j('Vui lòng nhập đúng và đủ thông tin')
        } catch (error) {
            j(error);
        }
    });
};

exports.get_students_in_room = room_id => {
    return new Promise(async (r, j) => {
        try {
            const room = await firestoreServices.get_one('Rooms', room_id);
            const students = []
            await asyncForEach(room.students_uid, async uid => {
                const user = await firestoreServices.get_one('users', uid);
                students.push(user);
            })
            r(students);
        } catch (error) {
            j(error)
        }
    })
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}