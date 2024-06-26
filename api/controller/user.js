var express = require('express')
var router = express.Router();
var { createUser, loginUser, logout, getUserList } = require('../concrete/userConcrete')

// <api>/users/login
router.post('/login', (req, res) => {
    try {

        loginUser(req.body).then((data) => {
            if (!data) {
                return res.status(409).send({ message: 'Credential not valid' })
            } else {
                res.cookie(`token`, data.user.getIdTokenResult(), { path: '/', maxAge: '3600' })
                return res.status(200).json({ message: "Created Successfully", data: data.user.email })
            }
        }, (error => {
            return res.status(403).send({ message: 'Credential not valid' })
        }))

    }
    catch (e) {
        res.status(500).json({ message: 'Server error' });
        // throw e;
        console.log("error in login : ", e);
    }
});


// <api>/users/register
router.post('/register', async (req, res) => {
    try {

        let userData = await createUser(req.body);
        if (!userData) {
            return res.status(409).send({ message: 'Email already exists.' })
        } else {

            res.cookie(`token`, userData.user.getIdTokenResult(), { path: '/', maxAge: '3600' })
            return res.status(201).json({ message: "Created Successfully", data: userData.user.email })

        }
    } catch (e) {
        return res.status(500).send({ message: 'Something went wrong' })
    }

});


router.get('/getUserList', async (req, res) => {
    let userList = await getUserList()
    // console.log("users", userList)
    if (userList == null) {
        return res.status(500).json("Something went wrong")
    }
    else {
        return res.status(200).json({ data: userList })
    }
})
module.exports = router;

