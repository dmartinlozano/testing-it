var express = require('express');
var mongoose = require('mongoose');
var request = require('request');
var jwt = require('jwt-simple');
var middleware = require('./middleware');
var TestSuite = mongoose.model('TestSuite');

module.exports = function(app, passport) {

  //Get the projects
  app.get('/api/testSuite', middleware.ensureAuthenticated, function(req, res) {
    TestSuite.find({}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            res.send(ts);
          }else{
            return res.status(500).send({ message: 'Suites not found' });
          };
        }
    });
  });

  //Get the projects
  app.get('/api/testSuite/:id', middleware.ensureAuthenticated, function(req, res) {
    TestSuite.findOne({_id: req.params.id},function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            res.send(ts);
          }else{
            return res.status(500).send({ message: 'Suite not found' });
          };
        }
    });
  });

  //add a new test project
  app.put('/api/testSuite', middleware.ensureAuthenticated, function(req, res) {
      var newTS = new TestSuite({
        name: req.body.newTS.name,
        description: req.body.newTS.description,
        keywords: req.body.newTS.keywords,
        parent: req.body.newTS.parent,
        tpjId: req.body.newTS.tpjId
      });
      newTS.save(function(err, result) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
      });
      return res.send(newTS);
  });


  //update a field
  app.post('/api/testSuite/:id', middleware.ensureAuthenticated, function(req, res) {
    TestSuite.findOne({_id: req.params.id}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (!ts) {
            return res.status(500).send({ message: "Suite test doesn't exists" });
          }else{
            ts[req.body.field] = req.body.newValue;
            TestSuite.findOneAndUpdate({_id:req.params.id}, ts, {upsert:true}, function(err, doc){
                if (err) res.status(500).send({ message: err.message });
                return res.send("succesfully saved");
            });
          };
        }
    });
  });

  //delete a test suite
  var deleteTS = function (req, res, id, errors) {
    TestSuite.findOne({_id: req.params.id}, function(err, ts) {
      if(err){
          console.log(err);
        }
        else{
          if (ts) {
            ts.remove(function(err, result) {
              if (err) {
                errors.push(err.message);
                //return res.status(500).send({ message: err.message });
              }
              //return res.send("succesfully deleted");
            });
          }else{
            errors.push(id + " suite test doesn't exists");
            //return res.status(500).send({ message: "Suite test doesn't exists" });
          };
        }
    });
  };

  app.delete('/api/testSuite/:id', middleware.ensureAuthenticated, function(req, res) {
    var errors = [];
    deleteTS(req, res, req.params.id,errors);
    if (errors.length === 0 ){
      return res.send("succesfully deleted");
    }else{
      return res.status(500).send({ message: errors.join(", ")});
    };
  });

  //delete a test plan
  app.delete('/api/deleteTSRecursive/:id', middleware.ensureAuthenticated, function(req, res) {
    var errors = [];
    var ids = req.params.id.split(',');
    for(var i=0;i<ids.length;i++){
      deleteTS(req, res, ids[i], errors);
    };
    if (errors.length === 0 ){
      return res.send("succesfully deleted");
    }else{
      return res.status(500).send({ message: errors.join(", ")});
    };
  });
};
