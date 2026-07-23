export default class CssBuilder {

  async build() {

    return `
html, body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: #f5f5f5;
}

.screen {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 40px;
}

h1 {
  margin: 0;
}
`;

  }

}
