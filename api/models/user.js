const helperServices = require('../services/helper');
const firestoreService = require('../services/firestore');
const admin = require('firebase-admin');
const db = admin.firestore();
exports.get_all_students = () => {
    return new Promise((r, j) => {
        firestoreService.get_all_data_from_col('users').then(data => {
            data.splice(data.findIndex(x => x.email == 'admin@examreg.com'), 1);
            r(data);
        }).catch(err => j(err));
    })
}

exports.import_students = (dataFromReq) => {
    return new Promise(async (r, j) => {

        let results = {
            successed: [],
            errors: {}
        }
        for (let i = 0; i < dataFromReq.length; i++) {

            await new Promise((resolve, reject) => {
                admin.auth().createUser({
                        email: dataFromReq[i].email,
                        password: dataFromReq[i].password,
                        displayName: dataFromReq[i].fullName,
                    })
                    .then(function (userRecord) {
                        admin.auth().setCustomUserClaims(userRecord.uid, {
                            student: true
                        }).then(() => {
                            db.collection('users').doc(userRecord.uid).set({
                                email: dataFromReq[i].email,
                                fullName: dataFromReq[i].fullName,
                                student: true,
                                gender: dataFromReq[i].gender,
                                birthday: dataFromReq[i].birthday,
                                homeTown: dataFromReq[i].homeTown,
                                mssv: dataFromReq[i].mssv,
                                cmnd: dataFromReq[i].cmnd,
                                username: dataFromReq[i].username
                            }).then(() => {
                                results.successed.push(dataFromReq[i].mssv);
                                resolve()
                            })
                        })

                    })
                    .catch(error => {
                        results.errors = {
                            mssv: dataFromReq[i].mssv,
                            email: dataFromReq[i].email,
                            error: error.errorInfo.code
                        }
                        r(results);
                    })
            })
            if ((i + 1) == dataFromReq.length) r(results);
        }
    })
}

exports.list_user = () => {

    admin.auth().listUsers()
        .then(function (listUsersResult) {
            listUsersResult.users.forEach(function (userRecord) {
                if (userRecord.uid !== 'lu4MDHHQJNTNSmbwwHx3ffNWl6t1')
                    admin.auth().setCustomUserClaims(userRecord.uid, {
                        student: true
                    }).then(() => {
                        admin.auth().getUser(userRecord.uid).then((userRecord) => {
                            // The claims can be accessed on the user record.

                        });
                        // The new custom claims will propagate to the user's ID token the
                        // next time a new one is issued.
                    });
            });
        })
}

exports.get_email = username => {
    return new Promise((r, j) => {
        console.log(username);
        db.collection('users').where('username', '==', username).get().then(datas => {
            console.log(datas.size);
            if (datas.size == 0) {
                j('username không tồn tại')
            } else {
                datas.forEach((doc) => {
                    r(doc.data().email);
                })
            }
        })
    })

}