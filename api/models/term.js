const FirebaseService = require('../services/firestore');
const admin = require('firebase-admin');
const helperServices = require('../services/helper');

const db = admin.firestore();
exports.add_one_term = (body) => {
    try {
        return new Promise((r, j) => {
            // const regx = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
            // if(regx.test(body.from) && regx.test(body.to)) {
            body.active = true;
            FirebaseService.set_one('Terms', body).then(() => r()).catch(err => j(err));
            // }else j('sai định dạng ngày');
        })
    } catch (error) {
        j(error)
    }

}

exports.get_one_term = (doc) => {
    try {
        return new Promise((r, j) => {
            FirebaseService.get_one('Terms', doc).then((data) => r(data)).catch(err => j(err));
        })
    } catch (error) {
        j(error)
    }

}

exports.get_all_term = () => {
    try {
        return new Promise((r, j) => {
            FirebaseService.get_all_data_from_col('Terms').then(data => {
                let batch = db.batch();
                data.forEach(term => {
                    if(term.active) {
                        let now = helperServices.create_milisec();
                        
                        if((term.to - now) < 0) {
                            batch.update(db.collection('Terms').doc(term.id), {active: false});
                            term.active = false
                        }
                    }
                });
                batch.commit().then(()=>{
                    r(data);
                })
                
            }).catch(err => j(err));
        })
    } catch (error) {
        j(error)
    }
}

exports.get_all_term_active = () => {
    try {
        return new Promise(async (r, j) => {
            let datas = [];
            await db.collection('Terms').where('active', '==', true).select('name').get().then(docs => {
                docs.forEach(doc => {
                    let timeNow = helperServices.create_milisec();

                    let data = doc.data();
                    data.id = doc.id;
                    datas.push(data);
                });
            });
            r(datas);
        }).catch(err => j(err));
    } catch (error) {
        j(error)
    }
}

exports.modify_term = (id, value) => {
    try {
        return new Promise(async (r, j) => {
            if(value.active) {
                value.active = (value.active === 'true');
            }
            FirebaseService.update_one('Terms', id, value).then(() => r())
        }).catch(err => j(err));
    } catch (error) {
        j(error)
    }
}