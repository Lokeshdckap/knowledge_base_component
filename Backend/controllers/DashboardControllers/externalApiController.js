const db = require("../../utils/database");
const { Op, where } = require("sequelize");
const { sequelize, col } = require("../../utils/database");
const Batch = db.batch;
const Script = db.script;
const Page = db.pages;
const uuid = require("uuid");
const slugify = require("slugify");


const getBatchAndScriptsApi = async (req,res)=>{
    console.log(req);
}

module.exports = {
    getBatchAndScriptsApi
  };



