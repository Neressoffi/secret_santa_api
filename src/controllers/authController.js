const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const SECRET_KEY = require('../utils/key');

exports.register = async (req, res) => {
  try {
    // console.log(req);

    const {firstname, lastname, phone, email, username, password, roles} = req.body;
    // console.log(req.body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({username});
    if (existingUser) {
      return res.status(409).json({error: 'Utilisateur existe déjàs'});
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer un nouvel utilisateur
    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      email: email,
      username: username,
      roles: roles,
      password: hashedPassword,
    });

    // Enregistrer l'utilisateur dans la base de données
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur a eter bien Enregistere avec  success !!!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Générer le token JWT
    const token = jwt.sign({userId: user._id, username: user.username}, SECRET_KEY, {expiresIn: '1h'});

    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Erreur serveur'});
  }
};

exports.retrieve = async (req, res) => {
  try {
    let users = {}
    // Check if a 'role' query parameter is provided
    const givenRole = req.query.role || '';
    // console.log(givenRole);
    if(givenRole && givenRole.length > 0){
      users = await User.find({ roles: { $regex: givenRole, $options: 'i' } });
    }
    else {
      users = await User.find();
    }
    // Send the users as JSON in the response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

