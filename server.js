if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bcyrpt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const initialize = require('./passport-config')

initialize(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const app = express()

const users = []

app.set('view-engine', 'ejs')
app.set('views/pages', path.join(__dirname, 'views/pages'));

app.use(express.static(__dirname + '/views'));
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req,res) => {
    res.render('index.ejs')
})

app.get('/login', (req,res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req,res) => {
    res.render('register.ejs')
})

app.post('/register' , async (req,res) => {
    try {
        const hashedPassword = await bcyrpt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch (err) {
        res.redirect('/register')
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});