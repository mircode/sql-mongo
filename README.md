# Mongo SQL

标签（空格分隔）： mongo sql mongorc.js

在Mongo Shell上运行SQL查询

---
![mongosql][0]
### 一、简单查询
```
db.SQL("select * from log limit 0,10");
```
![简单查询][1]
### 二、分页查询
```
db.SQL("select user,service,ip,code,tcount from log limit 0,10");
```
![分页查询][2]
### 三、条件查询
```
db.SQL("select * from log where user='淘宝' order by tcount desc limit 0,10");
```
![条件查询][3]
### 四、复合条件查询
```
db.SQL("select * from log where user='淘宝' or (user='京东' and service like 'query.*') desc limit 0,10");
```
![复合条件查询][4]
### 五、分组查询
```
db.SQL("select user,service,sum(tcount) from log group by user,service order by msum asc limit 0,10");
```
![分组查询][5]



  [0]: https://raw.githubusercontent.com/mircode/mongosql/master/img/mongosql.gif
  [1]: https://raw.githubusercontent.com/mircode/mongosql/master/img/simple_sql.png
  [2]: https://raw.githubusercontent.com/mircode/mongosql/master/img/page_sql.png
  [3]: https://raw.githubusercontent.com/mircode/mongosql/master/img/where_sql.png
  [4]: https://raw.githubusercontent.com/mircode/mongosql/master/img/where_mutil_sql.png
  [5]: https://raw.githubusercontent.com/mircode/mongosql/master/img/group_sql.png
