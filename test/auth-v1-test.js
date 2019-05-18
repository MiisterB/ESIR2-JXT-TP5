const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../app");

chai.should();
chai.use(chaiHttp);

describe("Users tests", () => {
  it("login should fail (bad login)", done => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send({ login: "roswre", password: "azett" })
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property("message");
        res.body.message.should.equal("Unauthorized");
        done();
      });
  });

  it("login should fail (no login)", done => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.should.have.property("message");
        res.body.message.should.equal("Unauthorized");
        done();
      });
  });

  it("login sucessfull", done => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send({ login: "rose", password: "JXT" })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.have.property("message");
        res.body.message.should.equal("Ok");
        res.body.should.have.property("access_token");
        done();
      });
  });

  it("check access fail", done => {
    chai
      .request(app)
      .get("/v1/auth/verifyaccess")
      .set("Authorization", `bearer ftbfjhewbhfwebhfjwelfjhejwkgfw`)
      .end((error, response) => {
        response.should.have.status(401);
        response.body.should.have.property("message");
        response.body.message.should.equal("Unauthorized");
        done();
      });
  });

  it("check access without header", done => {
    chai
      .request(app)
      .get("/v1/auth/verifyaccess")
      .end((error, response) => {
        response.should.have.status(401);
        response.body.should.have.property("message");
        response.body.message.should.equal("Unauthorized");
        done();
      });
  });

  it("check access sucessfully", done => {
    chai
      .request(app)
      .post("/v1/auth/login")
      .send({ login: "rose", password: "JXT" })
      .end((err, res) => {
        const token = res.body.access_token;
        chai
          .request(app)
          .get("/v1/auth/verifyaccess")
          .set("Authorization", `bearer ${token}`)
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.have.property("message");
            response.body.message.should.equal("Ok");
            done();
          });
      });
  });

});
