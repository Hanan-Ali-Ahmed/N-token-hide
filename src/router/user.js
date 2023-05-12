const express = require("express")
const router = express.Router()
const User = require("../model/user")
const bcryptjs = require('bcryptjs');

//////////////      
router.post("/users", (req, res) => {
    const user = new User(req.body)
    user.save()
        .then((user) => {
            res.status(200).send(user)
        })
        .catch((e) => {
            res.status(400).send(e)
        })
})
//////////////////////////////////////
router.get("/users", (req, res) => {

    User.find({})

        .then((user) => {
            res.status(200).send(user)
        })
        .catch((e) => {
            res.status(400).send(e)
        })
})
//////////////////////////////////
router.get("/users/:id", (req, res) => {
    const _id = req.params.id

    User.findById(_id)

        .then((user) => {
            if (!user) {
                return res.status(400).send("Sorry, The User Does Not Exist")
            }
            res.status(200).send(user)
        })


        .catch((e) => {
            res.status(401).send(e)
        })
})

//////////////////
router.patch('/users/:id', async (req, res) => {

    try {
        const updates = Object.keys(req.body)
        // console.log(updates)
        const _id = req.params.id
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send("Sorry, The User Does Not Exist")
        }
        updates.forEach((ele) => (user[ele] = req.body[ele]))
        await user.save()
        res.status(200).send(user)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

//////////////
router.delete('/users/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(404).send("Sorry, The User Does Not Exist")
        }
        res.status(200).send(user)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

///////////////////
router.post("/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        console.log(user);
        const token = await user.generateToken()

        res.status(200).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e.message)
    }
})
 ////////////
 router.post('/logout', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(400).send("Error, Verify Your Email or Password!");
    }
  
    const ismatch = await bcryptjs.compare(password, user.password);
  
    if (!ismatch) {
      return res.status(400).send("Error, Verify Your Email or Password!");
    }
  
    await user.removetoken();
    await user.removeUser();
  
    res.status(200).send("Signed Out Successfully");
  });    
  

  ///////////////////////////////////////////////


router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//////////////////////

module.exports = router
