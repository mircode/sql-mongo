# Mongo SQL

标签（空格分隔）： mongo sql mongorc.js

---
![mongosql][1]

### 一、安装手册
安装好Mongo然后将.mongorc.js放到系统的家目录。
#### 1、window
![window][2]
#### 2、linux
![linux][3]

### 二、简单查询
```
db.SQL("select * from log limit 0,10");
```
![简单查询][4]
### 三、分页查询
```
db.SQL("select user,service,ip,code,tcount from log limit 0,10");
```
![分页查询][5]
### 四、条件查询
```
db.SQL("select * from log where user='淘宝' order by tcount desc limit 0,10");
```
![条件查询][6]
### 五、复合条件查询
```
db.SQL("select * from log where user='淘宝' or (user='京东' and service like 'query.*') desc limit 0,10");
```
![复合条件查询][7]
### 六、分组查询
```
db.SQL("select user,service,sum(tcount) from log group by user,service order by msum asc limit 0,10");
```
![分组查询][8]



  [1]: https://raw.githubusercontent.com/mircode/mongosql/master/img/mongosql.gif
  [2]: https://raw.githubusercontent.com/mircode/mongosql/master/img/window.png
  [3]: https://raw.githubusercontent.com/mircode/mongosql/master/img/linux.png
  [4]: https://raw.githubusercontent.com/mircode/mongosql/master/img/simple_sql.png
  [5]: https://raw.githubusercontent.com/mircode/mongosql/master/img/page_sql.png
  [6]: https://raw.githubusercontent.com/mircode/mongosql/master/img/where_sql.png
  [7]: https://raw.githubusercontent.com/mircode/mongosql/master/img/where_mutil_sql.png
  [8]: https://raw.githubusercontent.com/mircode/mongosql/master/img/group_sql.png
