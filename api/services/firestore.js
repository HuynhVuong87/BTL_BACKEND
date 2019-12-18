const admin = require('firebase-admin');
const helperServices = require('../services/helper');

const db = admin.firestore();

exports.get_all_data_from_col = (col) => {
    
    return new Promise(async (r, j) => {
        let datas = [];
        await db.collection(col).get().then(docs => {

            docs.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                datas.push(data)
            })
        }).catch(err => j(err));
        r(datas);
    })
}

exports.get_all_data_from_col_with_field = (col, field) => {
    
    return new Promise(async (r, j) => {
        let datas = [];
        await db.collection(col).select(field.toString()).get().then(docs => {
            docs.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                datas.push(data)
            })
        }).catch(err => j(err));
        r(datas);
    })
}

exports.set_one = (col, val) => {
    val.ctime = helperServices.create_milisec();
    return new Promise(async (r, j) => {
        await db.collection(col).doc().set(val).then(() => r()).catch(err => j(err))
    })
}

exports.update_one = (col, doc, val) => {
    val.mtime = helperServices.create_milisec();
    return new Promise(async (r, j) => {
        await db.collection(col).doc(doc.toString()).update(val).then(() => r()).catch(err => j(err))
    })
}

exports.get_one = (col, doc) => {
    return new Promise(async (r, j) => {
        await db.collection(col).doc(doc.toString()).get().then((doc) => {
            let data = doc.data();
            data.id = doc.id;
            r(data);
        }).catch(err => j(err))
    })
}

exports.delete_one = (col, doc) => {
    return new Promise(async (r, j) => {
        await db.collection(col).doc(doc.toString()).delete().then(() => {
            r();
        }).catch(err => j(err))
    })
}

exports.check_doc_exist_in_col = (col, doc) => {
    return new Promise(async (r, j) => {
        await db.collection(col).doc(doc.toString()).get().then((doc) => {
            if (doc.exists)
                r(true)
            else
                r(false)
        }).catch(err => j(err))
    })
}
exports.check_doc_exist_in_col_by_field = (col, field, val) => {
    return new Promise(async (r, j) => {
        await db.collection(col).where(field, '==', val).get().then((docs) => {
            if (docs.size > 0)
                r(true)
            else
                r(false)
        }).catch(err => j(err))
    })
}

exports.get_id_from_mssv = mssv => {
    return new Promise((r,j)=>{
        db.collection('users').where('mssv', '==', mssv.toString()).limit(1).get().then((docs)=>{
            
            if(docs.size > 0) {
                docs.forEach(doc=>{
                    r(doc.id)
                }) 
            }
                
            else
                j('mssv '+ mssv+ ' không tồn tại, vui lòng kiểm tra lại')
        })
    })
}

exports.get_one_by_field = (col, field, value) => {
    return new Promise((r,j)=>{
        db.collection(col).where(field, '==', value).limit(1).get().then((docs)=>{
            
            if(docs.size > 0) {
                docs.forEach(doc=>{
                    let data = doc.data();
                    data.id = doc.id;
                    r(data)
                }) 
            }
                
            else
                j('mssv '+ mssv+ ' không tồn tại, vui lòng kiểm tra lại')
        })
    })
}