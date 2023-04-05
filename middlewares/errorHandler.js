function errorHandler(err, req, res, next) {
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    console.log(err);
    const message = err.errors[0].message;
    res.status(400).json({ message })
  } else if (err.name === 'InvalidUser') {
    res.status(401).json({ message: 'Wrong Email/Password' });
  } else if (err.name === 'Unauthorized') {
    res.status(401).json({ message: 'Invalid Access Token' });
  } else if (err.name === 'Forbidden') {
    res.status(403).json({ message: 'You are forbidden to do this action' })
  } else if (err.name === 'NotFound') {
    res.status(404).json({ message: 'Data Not Found' })
  } else {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = errorHandler;