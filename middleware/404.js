const notFound = (req, res) => {
  res.status(404).send("Page Not Found. Please enter correct URL");
};

module.exports = notFound;
