# -*- coding: utf-8 -*-

import xlrd
import re  
import sys
import datetime

reload(sys)
sys.setdefaultencoding('utf8')

from pymongo import MongoClient
client = MongoClient('mongodb://127.0.0.1:27017')
db = client.qtc

def main():
	ex = xlrd.open_workbook('../../files/baodan_20190410.xlsx')
	sheet = ex.sheet_by_index(0)
	for i in range(2,sheet.nrows):
		data = {
			'orderId':sheet.row(i)[6].value,
      'type':'FUXING',
      'orderStatus':1 if sheet.row(i)[12].value == '承保' else 4,
      'importDate':datetime.datetime.now().strftime('%Y-%m-%d'),
      'spentTotal':int(sheet.row(i)[49].value),
      'remainTotal':int(sheet.row(i)[50].value),
      'submitter':sheet.row(i)[55].value,

      'insuranceName':sheet.row(i)[7].value,
      'insuranceApplyDate':fiveDigitsToDate(sheet.row(i)[9].value), 
      'insuranceStartDate':fiveDigitsToDate(sheet.row(i)[10].value), 
      'insuranceEndDate':fiveDigitsToDate(sheet.row(i)[11].value), 
      'insuranceAmount':sheet.row(i)[8].value, 
      'insurancePeriod':sheet.row(i)[13].value, 

      'paymentPeriod':sheet.row(i)[14].value, 
      'paymentFrequency':sheet.row(i)[16].value,
      'paymentEachTime':sheet.row(i)[15].value, 
      'paymentMethod':sheet.row(i)[17].value,

      
      'applicantName':sheet.row(i)[0].value,
      'applicantPhone':sheet.row(i)[5].value,
      'applicantEmail':sheet.row(i)[19].value,
      'applicantIdType':sheet.row(i)[3].value,
      'applicantIdNumber':sheet.row(i)[4].value,
      'applicantSex':0 if sheet.row(i)[1].value == '男' else 1,
      'applicantBirth':fiveDigitsToDate(sheet.row(i)[2].value),
      'applicantHeight':str(sheet.row(i)[24].value),
      'applicantWeight':str(sheet.row(i)[25].value),
      'applicantAddress':sheet.row(i)[26].value,
      'applicantZipCode':sheet.row(i)[27].value,
      'applicantJobCode':sheet.row(i)[23].value,

      'insuredName':sheet.row(i)[28].value,
      'insuredPhone':sheet.row(i)[34].value,
      'insuredEmail':sheet.row(i)[35].value,
      'insuredIdType':sheet.row(i)[32].value,
      'insuredIdNumber':sheet.row(i)[33].value,
      'insuredSex':0 if sheet.row(i)[29].value == '男' else 1, 
      'insuredBirth':fiveDigitsToDate(sheet.row(i)[31].value),
      'insuredHeight':str(sheet.row(i)[40].value),
      'insuredWeight':str(sheet.row(i)[41].value),
      'insuredAddress':sheet.row(i)[42].value,
      'insuredZipCode':sheet.row(i)[43].value,
      'insuredJobCode':sheet.row(i)[39].value,
      
      'insuredApplicantRelation':sheet.row(i)[30].value,
      'insuredHealthInfo':sheet.row(i)[18].value,
		}
		db.orders.insert_one(data)


def fiveDigitsToDate(num):
	# return date + datetime.timedelta(hours=8)	# 中国时区
   return datetime.datetime(1899, 12, 30) + datetime.timedelta(num)

main()
