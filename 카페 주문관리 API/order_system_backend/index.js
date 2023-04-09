const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 8080;

// cors
const cors = require("cors");
app.use(cors());

// morgan
const morgan = require("morgan");
app.use(morgan("dev"));

// multer
// node 내장 라이브러리
const path = require("path");
const multer = require("multer");
const { takeCoverage } = require("v8");

// 업로드
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, done) => {
      done(null, "public/");
    },

    // 업로드 할 경우 파일 이름 형식
    filename: (req, file, done) => {
      // 해당 파일의 확장자만 가져옴
      const ext = path.extname(file.originalname);

      // 확장자를 제외한 파일 이름
      const fileNameExceptExt = path.basename(file.originalname);

      // 파일이름 + 현재 시간 + 확장자
      // ex) hello.jpg -> hello182902345.jpg
      // 저장할 파일 이름 형식
      const saveFileName = fileNameExceptExt + Date.now() + ext;
      done(null, saveFileName);

      /*
            파일 이름을 이렇게 하는 이유:
            원래 존재하는 파일의 이름과 같은 파일을 업로드하는 경우
            원래 파일이 업로드 파일로 덧씌워질 수 있기 때문
            또한 DB에 파일의 주소를 올릴 거임
            */
    },
  }),
});

// 정적 파일 서비스
app.use("/public", express.static("public"));

/*
파일 업로드 -> DB에 파일 경로 저장
-> front에서 경로에 대해 요청해서 불러오기
(public/image1.jpg) -> localhost:8080/public/image1.jpg
*/

// body 데이터 받아오기
app.use(express.json());

/* menu
GET /api/menus
GET /api/menus/:id
POST /api/menus
PATCH /api/menus/:id
POST /api/menus/:id/image
DELETE /api/menus/:id
*/

// GET /api/menus
// 전체 메뉴 조회
app.get("/api/menus", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM menus");
    return res.json(data[0]);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "전체 메뉴 목록 조회에 실패하였습니다.",
    });
  }
});

// GET /api/menus/:id
// 한가지 메뉴 조회
app.get("/api/menus/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // DB의 id를 검색하는 거임
    const data = await pool.query("SELECT * FROM menus WHERE id = ?", [id]);

    return res.json(data[0]);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "메뉴 조회에 실패하였습니다.",
    });
  }
});

// POST /api/menus
// 이미지 1장 업로드
app.post("/api/menus", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    // 파일 경로
    const file_path = req.file.path;
    console.log(req.body);

    // 파일 업로드
    const { name, description } = req.body;

    /*
        const query = `INSERT INTO menus(name,description,image_src)
        VALUES ({$name},{$description},{$image_src})`;
        아래 코드는 위 코드와 같다.

        mysql2 문법인 '?'로 코드 가독성을 좀 더 좋게 만든 것
        */
    const data = await pool.query(
      `
        INSERT INTO menus (name,description,image_src)
        VALUES (?,?,?)
        `,
      [name, description, file_path]
    );

    return res.json({
      success: true,
      message: "메뉴 등록에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "메뉴 등록에 실패하였습니다.",
    });
  }
});

// PATCH /api/menus/:id
// 메뉴 정보 수정
app.patch("/api/menus/:id", async (req, res) => {
  try {
    // req.params :id
    const data = await pool.query(
      `
        UPDATE menus
        SET name = ?, description = ?
        WHERE id = ?`,
      [req.body.name, req.body.description, req.params.id]
    );

    // req.body

    return res.json({
      success: true,
      message: "메뉴 정보 수정에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "메뉴 정보 수정에 실패하였습니다.",
    });
  }
});

// POST /api/menus/:id/image
// 메뉴 이미지 등록
// 파일 업로드는 무조건 post
app.post("/api/menus/:id/image", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    // 파일 경로
    const file_path = req.file.path;

    const date = await pool.query(
      `
        UPDATE menus
        SET image_src = ?
        WHERE id = ?`,
      [file_path, req.params.id]
    );

    return res.json({
      success: true,
      message: "메뉴 이미지 등록에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "메뉴 이미지 등록에 실패하였습니다.",
    });
  }
});

// DELETE /api/menus/:id
// 메뉴 삭제
app.delete("/api/menus/:id", async (req, res) => {
  try {
    const data = await pool.query("DELETE FROM menus WHERE id = ?", [
      req.params.id,
    ]);

    return res.json({
      success: true,
      message: "메뉴 삭제에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "메뉴 삭제에 실패하였습니다.",
    });
  }
});

// orders
/* order

// GET /api/orders
// POST /api/orders
// GET /api/orders/:id
// PATCH /api/orders/:id
// DELETE /api/orders/:id
*/

// GET /api/orders
// 주문 조회
app.get("/api/orders", async (req, res) => {
  try {
    // menus_id를 가져와서 데이터 조회
    // quantity, request_detail -> orders 테이블
    // name, description -> menus 테이블
    // id는 중복 a.id라고 명시
    const data = await pool.query(`
        SELECT a.id, menus_id,quantity, request_detail, name, description
        FROM orders as a
        INNER JOIN menus as b
        ON a.menus_id = b.id
        ORDER BY a.id DESC
        `);

    return res.json(data[0]);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "주문 전체 내역 조회에 실패하였습니다.",
    });
  }
});

// POST /api/orders
// 주문
app.post("/api/orders", async (req, res) => {
  try {
    // menus_id를 넣을 경우
    // 외래키이기 때문에 menus 테이블에 존재하는 id를 넣어야 한다.
    const data = await pool.query(
      `
        INSERT INTO orders (quantity, request_detail, menus_id)
        VALUES (?, ?, ?)
        `,
      [req.body.quantity, req.body.request_detail, req.body.menus_id]
    );

    return res.json({
      success: true,
      message: "주문에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "주문에 실패하였습니다.",
    });
  }
});

// 과제
// 주요코드 + POSTMAN 캡쳐

// GET /api/orders/:id
// 주문 내역 상세 조회
app.get("/api/orders/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);

    return res.json(data[0]);
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "주문 내역 조회에 실패하였습니다.",
    });
  }
});

// PATCH /api/orders/:id
// 주문 내역 수정
app.patch("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query(
      `
        UPDATE orders
        SET quantity = ?, request_detail = ?, menus_id = ?
        WHERE id = ?
        `,
      [
        req.body.quantity,
        req.body.request_detail,
        req.body.menus_id,
        req.params.id,
      ]
    );

    return res.json({
      success: true,
      message: "주문 내역 수정에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "주문 내역 수정에 실패하였습니다.",
    });
  }
});

// DELETE /api/orders/:id
// 주문 내역 삭제
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const data = await pool.query("DELETE FROM orders WHERE id = ?", [
      req.params.id,
    ]);

    return res.json({
      success: true,
      message: "주문 내역 삭제에 성공하였습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      massage: "주문 내역 삭제에 실패하였습니다.",
    });
  }
});

app.listen(PORT, () => console.log("this server listening on " + PORT));
