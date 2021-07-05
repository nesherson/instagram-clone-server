function signup(req, res) {
  const response = {
    user: 'Nesh',
    id: 101,
  };

  res.status(200).send(response);
}

export { signup };
export default { signup };
