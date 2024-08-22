exports.extractPassword = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let { user, ...otherFields } = arr[i];
    const { password, ...userFields } = user;
    arr[i] = { ...otherFields, user: userFields };
  }
  return arr;
};
