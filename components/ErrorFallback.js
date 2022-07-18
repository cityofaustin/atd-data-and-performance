import React from "react";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

export default function ErrorFallback() {
  return (
    <>
      <Head>
        <title>Something went wrong</title>
        <meta property="og:title" content="Something went wrong..." />
      </Head>
      <div className="wrapper">
        <Nav isHome />
        <Container className="main">
          <Row className="pt-5">
            <Col className="text-center">
              <h6>Something went wrong :/</h6>
              {/* we don't want to use next/link here, because the error state will not clear */}
              <p>
                Try refreshing your page or going <a href="/">home</a>.
              </p>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    </>
  );
}
