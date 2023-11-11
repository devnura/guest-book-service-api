// Function to create and print a matrix
const createMatrix = (rows, cols) => {
  const matrix = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i + 1) * (j + 1))
  );

  matrix.forEach(row => console.log(row.join(' ')));
};

module.exports = createMatrix;

createMatrix(5, 5);