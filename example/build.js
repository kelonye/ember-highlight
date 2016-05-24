#!/usr/bin/env node

var join = require('path').join;
var builder = require('component-hooks');
var out = join(__dirname, 'public');
var cwd = join(__dirname, 'client');

builder(cwd)
  .copy()
  .log()
  .standalone()
  .out(out)
  .dev()
  .end(function(err){
    if (err) console.log(err);
  });
