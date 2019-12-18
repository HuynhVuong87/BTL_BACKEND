const admin = require('firebase-admin');
const helperServices = require('../services/helper');

const firestore = admin.firestore();

exports.create_admin_FirebaseAuth = () => {
    const email = 'admin@lapnghiep.com';
    const username = 'admin';
    admin.auth().getUserByEmail('admin@lapnghiep.com')
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully fetched user data:', userRecord.toJSON());
        })
        .catch(function (error) {
            console.log(error.code);
            admin.auth().createUser({
                    email: email,
                    emailVerified: false,
                    phoneNumber: '+84328803015',
                    password: 'admin123',
                    displayName: 'ADMIN',
                    disabled: false,
                    customClaims: {
                        role: {
                            id_role: 1
                        }
                    }
                })  
                .then(function (userRecord) {

                    console.log(userRecord);
                    firestore.collection('usersMobile').doc(userRecord.uid).set({
                        email: email,
                        name: username,
                        uid: userRecord.uid,
                        role: {
                            id_role: 1,                            
                        }
                    }).then(() => console.log('create successs'));
                })
                .catch(function (error) {
                    console.log('Error importing users:', error);
                });
        });
}

exports.check = (uid)=>{
    console.log(uid);
}
