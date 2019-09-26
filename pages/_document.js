import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      // eslint-disable-next-line jsx-a11y/html-has-lang
      <html>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/react-table@latest/react-table.css"
          />
          <script src="https://unpkg.com/react-table@latest/react-table.js" />
          <script src="https://unpkg.com/react-table@latest/react-table.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
