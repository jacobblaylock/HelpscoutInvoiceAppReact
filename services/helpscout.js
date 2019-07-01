// var filewriter = require('./filewriter');
const mysql = require('mysql')
const striptags = require('striptags')
const config = require('../config/osticket')
const iconv = require('iconv-lite')

/**
 * Helpscout constructor function
 *
 */
var Helpscout = function () {
  // console.log(config)
  this.poolOptions = {
    //properties...
    connectionLimit: config.connectionLimit,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  }
  this.poolOpen = false
}

Helpscout.prototype.reformatTicketBody = function (ticket) {
  var text = ''
  ticket.forEach(function (thread) {
    if (thread.body && thread.state !== 'hidden') {
      text = text +
        thread.createdAt + '  (' + thread.createdBy.first + ' ' + thread.createdBy.last + '):\n\n' +
        striptags(thread.body.replace(/<br>/g, '\n'))
          .replace(/^\s+$/gm, '\n')
          .replace(/\n{3,10}/g, '\n')
          // Poplar Disclaimer
          .replace(/^NOTE: This E-mail is covered by the Electronic Communications Privacy Act,.*/gm, '')
          // Cellnetix Disclaimer
          .replace(/DISCLAIMER: \n^This message is intended for the sole use of the addressee,.*/gm, '')
          // Bako Disclaimer
          .replace(/We want to know how we're doing!\nPlease fill out our Client Satisfaction Survey today!/gm, '')
          // Peak Disclaimer
          .replace(/Our Mission:\s+Enabling medical institutions to reach their full potential by matching the very best technology solutions to their business needs/gm, '')
          .replace(/This transmission may contain information that is privileged, confidential and\/or exempt from disclosure under applicable law\. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution, or use of the information contained herein \(including any reliance thereon\) is STRICTLY PROHIBITED\. If you received this transmission in error, please immediately contact the sender and destroy the material in its entirety, whether in electronic or hard copy format\. Thank you\./gm, '')
          .replace(/[^\x00-\x7F]/g, ' ')
        + '\n\n'
    }
  })
  text = text.replace(/'/g, "''")
  return iconv.encode(text, 'latin1')
};

Helpscout.prototype.mysqlOpen = function () {
  this.pool = mysql.createPool(this.poolOptions)
  this.poolOpen = true
}

Helpscout.prototype.mysqlClose = function () {
  this.pool.end(err => {
    if (err) {
      console.log('pool.end error:', err)
    } else {
      console.log('Database connection closed.')
      this.poolOpen = false;
    }
  });
}

Helpscout.prototype.mysqlTestConnection = function (callback) {
  if (!this.poolOpen) {
    this.mysqlOpen()
  }
  this.pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err)
      callback({
        message: err.code,
        connected: false
      })
    } else {
      connection.release();
      callback({
        message: 'Connected',
        connected: true
      })
    }

  });
}

Helpscout.prototype.mysqlQuery = function (query, callback) {
  if (!this.poolOpen) {
    this.mysqlOpen()
  }
  this.pool.getConnection(function (err, connection) {

    connection.query(query, function (err, rows) {
      if (!!err) {
        console.log('------------------\n' + query + '-------------------\n')
        console.log('QUERY ERROR:\n', 'Query: ', query, '\nError: ', err, '\n')
        callback(err)
      } else {
        connection.release()
        callback(rows)
      }
    })
  })
}

Helpscout.prototype.insertTicket = function (ticket, callback) {
  var query;
  query = "call helpscoutInsert(" +
    ticket.number + ",'" +
    ticket.closedAt.replace(/T|Z/g, ' ') + "','" +
    //"1905-01-01', '" +
    ticket.assignee.first + "','" +
    ticket.assignee.last + "','" +
    this.clientMap(ticket.clientId) + "','" +
    ticket.subject.replace(/'/g, "''") + "','" +
    ticket.status + "','" +
    ticket.createdAt.replace(/T|Z/g, ' ') + "','" +
    ticket.modifiedAt.replace(/T|Z/g, ' ') + "','" +
    this.reformatTicketBody(ticket.threads) + "','" +
    ticket.billableHours + "')"
  // console.log(query)
  // callback(query)
  this.mysqlQuery(query, function (row) {
    callback(row)
  })
}

Helpscout.prototype.insertTickets = function (callback) {
  var counter = this.threads.length;
  var rows = []
  this.threads.forEach(function (ticket) {
    this.insertTicket(ticket, function (row) {
      rows.push({ ticketNumber: ticket.number, ...row })
      counter--;
      if (counter === 0) {
        callback(rows);
      }
    })
  }, this)
}

Helpscout.prototype.clientMap = function (clientId) {
  var client = config.clientMap;
  if (client[clientId]) {
    return client[clientId];
  } else {
    return 'OTHER';
  }
}

Helpscout.prototype.writeThreadsToFile = function () {
  this.threads.forEach(function (t) {
    filewriter.writeThreadToFile(t);
  })
}

module.exports = Helpscout



