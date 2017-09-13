import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from "@angular/common/http";
import * as moment from 'moment';
import crypto from 'crypto-browserify';
import { Buffer } from "buffer";

@Injectable()
export class AuthenticationProvider {
  
  masterKey = "L2UV2V0evI1UuP9ZL8SSTsa1CfSFZzW9giSKN2bGuI1ePM4kNxeKo1fTZHOsgwI7EkqylZ6COPXboYmoMEQe3g==";
  dateInRfc7231Format = moment().subtract(1, 'hours').format("ddd, DD MMM YYYY HH:mm:ss");
  dateWithTimeZone = this.dateInRfc7231Format + " GMT";
  
  // list all databases
  // result = this.getAuthorizationTokenUsingMasterKey("GET", "", "dbs", this.dateWithTimeZone, this.masterKey);
  
  // list all collections within a db
  //let result = getAuthorizationTokenUsingMasterKey("GET", "dbs/demodb", "colls", dateWithTimeZone, masterKey);
  
  // create new collection
  //let result = getAuthorizationTokenUsingMasterKey("POST", "dbs/demodb", "colls", dateWithTimeZone, masterKey);
  
  // list all documents
  //let result = getAuthorizationTokenUsingMasterKey("GET", "dbs/demodb/colls/student", "docs", dateWithTimeZone, masterKey);
  
  // result = this.getAuthorizationTokenUsingMasterKey("POST", "dbs/demodb/colls/student", "docs", this.dateWithTimeZone, this.masterKey);
  
  

  constructor(public httpClient: HttpClient) {
    console.log('Hello AuthenticationProvider Provider');
    console.log(this.dateWithTimeZone);
  
  }

  getToken() {
    return this.getAuthorizationTokenUsingMasterKey("GET", "docs", "dbs/DiscoveryAG/colls/Countries", this.dateWithTimeZone, this.masterKey);
  }

  getTokenDate() {
    return this.dateWithTimeZone;
  }

  getAuthorizationTokenUsingMasterKey(verb, resourceType, resourceId, date, masterKey) {  
    var key = new Buffer(masterKey, "base64");  

    var text = (verb || "").toLowerCase() + "\n" +   
               (resourceType || "").toLowerCase() + "\n" +   
               (resourceId || "") + "\n" +   
               (date || "").toLowerCase() + "\n" +   
               "" + "\n";

    var body = new Buffer(text, "utf8");  
    var signature = crypto.createHmac("sha256", key).update(body).digest("base64");
    var MasterToken = "master";  
    var TokenVersion = "1.0";  

    return encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  
}

}
