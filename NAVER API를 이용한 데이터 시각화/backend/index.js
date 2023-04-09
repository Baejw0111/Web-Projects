const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const morgan = require("morgan");
const PORT = 8081;

// .env 파일을 읽어올 수 있다
const dotenv = require("dotenv");
dotenv.config();

// 파일 작성
const fs = require("fs");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", (req, res) => {
  // dotenv에 작성한 내용 가져오는 법
  // process.env에 작성한 변수명

  console.log(process.env.CLIENT_ID);
  console.log(process.env.CLIENT_SECRET);

  return res.json({ test: "HELLO" });
});

/*
/api/data

GET POST DELETE
*/

// 파일 읽어서 리턴
app.get("/api/data", (req, res) => {
  // uploads/chart.json을 읽어서 리턴
  try {
    fs.readFile("./uploads/chart.json", "utf8", (error, data) => {
      if (error) {
        console.log(error);
      }

      // 문자열로 저장되어있는 chart.json을 다시 JSON 형식으로 변환해서 리턴
      return res.json(JSON.parse(data));
    });
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// 요청을 보내고 값을 파일로 저장
app.post("/api/data", async (req, res) => {
  const url = "https://openapi.naver.com/v1/datalab/search";
  const headers = {
    "X-Naver-Client-Id": process.env.CLIENT_ID,
    "X-Naver-Client-Secret": process.env.CLIENT_SECRET,
    "Content-Type": "application/json",
  };

  const request_body = {
    /* 필수값
    startDate, endData,
    timeUnit, keywordGroups
    */

    startDate: "2022-01-01",
    startDate: req.body.startDate,
    endDate: req.body.endDate,

    //date/week/monthdDate
    timeUnit: req.body.timeUnit,

    //주제어-검색어 묶음쌍
    keywordGroups: req.body.keywordGroups,
    /*
    [
      //groupName: 주제어
      //keywords: 검색어
      {
        groupName: "치킨",
        keywords: ["치킨", "교촌", "BBQ", "BHC"],
      },
      {
        groupName: "삼겹살",
        keywords: ["삼겹살", "고기"],
      },
    ],
    */
  };

  try {
    const result = await axios.post(url, request_body, {
      headers: headers,
    });
    console.log(result);

    /*
    result.data.results -> 파일로 저장

    JSON.stringify -> JSON -> 문자열
    JSON.parse -> 문자열 -> JSON
    */

    fs.writeFile(
      "./uploads/chart.json",
      JSON.stringify(result.data.results),
      function (err) {
        console.log(err);
      }
    );

    return res.json(result.data.results);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// 파일 삭제
app.delete("/api/data", (req, res) => {});

app.listen(PORT, () => console.log(`${PORT} 서버 기동 중`));
