/**
 * 用于打印Mongo查询出来的数据
 * 
 * eg:
 * db.collection.find({}).table();
 * 
 * eg:
 * db.table([
	{ 'pt_user' : 'szwst', 'pt_service' : '/xml/AirBook', 'pt_count' : 2 },
	{ 'pt_user' : 'taobao', 'pt_service' : '/xml/AirResValidateOrder', 'pt_count' : 3 },
	{ 'pt_user' : 'baosheng', 'pt_service' : '/xml/AirResRet', 'pt_count' : 13 },
	{ 'pt_user' : 'taobao', 'pt_service' : '/xml/AirAvail/A', 'pt_count' : 18244386 },
	{ 'pt_user' : 'renhe', 'pt_service' : '/xml/AirFareFlightShop/I', 'pt_count' : 583 },
	{ 'pt_user' : 'quna_partner', 'pt_service' : '/xml/AirBookOrder', 'pt_count' : 139 },
	{ 'pt_user' : 'BDE', 'pt_service' : '/xml/AirBook', 'pt_count' : 1837 },
	{ 'pt_user' : 'yxdl', 'pt_service' : '/xml/AirBook', 'pt_count' : 4 },
	{ 'pt_user' : 'AsiaTravel', 'pt_service' : '/xml/AirBook', 'pt_count' : 1 },
	{ 'pt_user' : 'etkts', 'pt_service' : '/xml/AirBook', 'pt_count' : 2 }
	]);

    +------------+------------------------+--------+
	|pt_user     |pt_service              |pt_count|
	+------------+------------------------+--------+
	|szwst       |/xml/AirBook            |2       |
	|taobao      |/xml/AirResValidateOrder|3       |
	|baosheng    |/xml/AirResRet          |13      |
	|taobao      |/xml/AirAvail/A         |18244386|
	|renhe       |/xml/AirFareFlightShop/I|583     |
	|quna_partner|/xml/AirBookOrder       |139     |
	|BDE         |/xml/AirBook            |1837    |
	|yxdl        |/xml/AirBook            |4       |
	|AsiaTravel  |/xml/AirBook            |1       |
	|etkts       |/xml/AirBook            |2       |
	+------------+------------------------+--------+
 */
+function(Mongo){
	
	// 配置字段最大的长度
	var config={
		MAX_FIELD_WIDTH:1,
	}
	/**
	 * 
	 * 用于格式化JSON格式,获取到JSON串,所有叶子节点
	 **/
	function format(doc,header,path){
		for(var key in doc){
			var val=doc[key];
			if(isObject(val)){
				format(val,header,path==undefined?key:path+'.'+key);
			}else {
				var width=0;
				if(isArray(val)){
	    			 val.forEach(function(e) {
	                    var length=JSON.stringify(e);;
	                    width=Math.max(child,length);
	                 });
	    		}else{
	    			width=getFieldsMaxWidth(val);
	    		}
	    		var max1=config.MAX_FIELD_WIDTH;
	    		var max2=(path==undefined?key:path+'.'+key).length;
	    		var max3=width;
	    		
	    		var k=path==undefined?key:path+'.'+key;
	    		var v=Math.max(max1,max2,max3);
	    		
	    		var flag=false;
	    		for(var i in header){
	    			if(header[i].name==k){
	    				header[i].width=Math.max(header[i].width,v);
	    				flag=true;
	    			}
	    		}
	    		if(!flag){
	    			header.push({name:k,width:v});
	    		}
			}
		}
	}
	/**
	 * 获取到表格头
	 */
	function getTableHeader(header){
		
		var dept=0;
		for(var i=0;i<header.length;i++){
			dept=Math.max(dept,header[i].name.split('.').length);
		}
		
		var table_header=[];
		// 保存表格头的最后一列
		table_header[dept]=header;
		
		while(dept>1){
			
			table_header[dept-1]=[];
			for(var i=0;i<table_header[dept].length;i++){
				
				var nd=table_header[dept][i];
				
				
				var val=nd.width;
				var level=nd.name.split('.').length;
				
				if(level==dept){
					
					var sumKey=nd.name.substring(0,nd.name.lastIndexOf('.'));
					
					var flag=false;
					for(var z in table_header[dept-1]){
						var item=table_header[dept-1][z];
						if(item.name==sumKey){
							item.width=item.width+(val+1);
							flag=true;
						}
					}
					if(!flag){
						table_header[dept-1].push({name:sumKey,width:val});
					}
				}else{
					table_header[dept-1].push({name:nd.name,width:val});
				}
				
			}
			dept--;
		}
		return table_header;
	}
	// 用于打印表格
	function printTable(table_header,docs){
		
		
		var bottom_row='+';
		
		// 打印表格头
		for(var i=1;i<table_header.length;i++){
			var split_row='+';
			var row='|';
			for(var j=0;j<table_header[i].length;j++){
				
				var name=table_header[i][j].name;
				var width=table_header[i][j].width;
				
				
				var level=name.split('.').length;
				if(level!=i){
					split_row+=new Array(width+1).join(' ')+'+';
					row+=new Array(width+1).join(' ')+'|';
				}else{
					split_row+=new Array(width+1).join('-')+'+';
					row+=name+new Array(width-name.length+1).join(' ')+'|';
				}
				
				
				if(i==table_header.length-1){
					bottom_row+=new Array(width+1).join('-')+'+';
				}
			}
			log(split_row);
			log(row);
		}
		log(bottom_row);
	
		//打印表格内容
		for(var i=0;i<docs.length;i++){
			var last_header=table_header[table_header.length-1];
			
			var row='|';
			for(var z=0;z<last_header.length;z++){
				var name=last_header[z].name;
				var width=last_header[z].width;
				var field=getValue(docs[i],name)
				
				row+=field+new Array(width-lenField(field)+1).join(' ')+'|';
				
			}
			log(row);
		}
		log(bottom_row);
	}
	/**
	 * 返回最大的列宽
	 * @param {Object} txt
	 */
	function getFieldsMaxWidth(txt){
		txt+='';
		var max=0;
		var lines=txt.split('\n');
		for(var i in lines){
			var len=lenField(lines[i]);
			max=Math.max(len,max);
		}
		return max;
	}
	/**
	 * 替换双字节的元素,替换为2个单字节的字符,然后计算长度
	 * @param {Object} str
	 */
	function lenField(str){
  		if (str==null) return 0;str+='';
		return str.replace(/[^\x00-\xff]/g,'01').length;
	}
	
	/**
	 * 更具path返回对应的值
	 * 
	 * input  a.c.d
	 * output a->c->d
	 * 
	 * @param {Object} obj
	 * @param {Object} path
	 */
	function getValue(obj,path){
		var names=path.split('.');
	    for(var i=0;i<names.length;i++) {
	        var name=names[i];
	        if (obj[name]===undefined) {
	            return undefined;
	        }
	        obj=obj[name];
	    }
	    if(isObject(obj)){
	        obj = undefined;
	    }
	    return obj;
	}
	/**
	 * 判断一个obj是否是一个对象
	 * @param {Object} obj
	 */
	function isObject(obj){
		var type=typeof obj; 
		return type==='function'||type==='object'&&!!obj;
	}
	/**
	 * 判断obj是否是一个数组
	 * @param {Object} obj
	 */
	function isArray(obj){
		if(Array.isArray){
			return 	Array.isArray(obj);
		}else{
			return toString.call(obj) === '[object Array]';
		}
	}
	
	/**
	   一、
	   
	 JSON数据: {a:{b:1,c:{d:1}},e:{f:1,g:1}}
	   
	   递归遍历JSON对象,获取到JSON中所有对象的根节点
	 
	 header:[{name:'a.b',width:3},{name:'a.c.d',width:5},{name:'e.f',width:3},{name:'e.g',width:3}]
	   
	   
	   二、通过 header[3]自低向上推算出其父节点
	   
	  header[3]=[{name:'a.b',width:3},{name:'a.c.d',width:5},{name:'e.f',width:3},{name:'e.g',width:3}]
	  header[2]=[{name:'a.b',width:3},{name:'a.c',width:5},{name:'e.f',width:3},{name:'e.g',width:3}]
	  header[1]=[{name:'a',width:8},{name:'e',width:6}]
	  
	    
	    
	  +-------------+-----------+
	  | a           | e         |  header[1]={a:1,e:1};
	  +-----+-------+-----+-----+
	  | a.b | a.c   | e.f | e.g |  header[2]={a.b:1,a.c:1,e.f:1,e.g:1}
	  |-----+-------+-----|-----|
	  | a.b | a.c.d | e.f | e.g |  header[3]={a.b:1,a.c.d:1,e.f:1,e.g:1}
	  +-----+-------+-----+-----+
	
	     三、打印表格
	  
	  +-------------+-----------+
	  | a           | e         |
	  +-----+-------+-----+-----+
	  | a.b | a.c   | e.f | e.g |
	  |     +-------+     |     |
	  |     | a.c.d |     |     |
	  +-----+-------+-----+-----+
	* */

	// 解析JSON数据格式
	function table(docs){
		
		if(!docs){
			docs=this.toArray();
		}
		var header=[];
		
		// 计算出所有docs的叶子节点,和对应的数据宽度
		for(var i=0;i<docs.length;i++){
			format(docs[i],header)
		}
		// log(header);
		
		// 计算到需要打印的table的表头
		var table_header=getTableHeader(header);
		// log(table_header);
	
		// 打印表格
		printTable(table_header,docs);
		
	}
	
	/**
	 * 用于打印日志
	 */
	function log(lg){
		//console.info(lg);
		print(lg);
	}
	
	var software='';
		software+='           __  ___                           _____        __                       \n';
		software+='          /  |/  /___  ____  ____ _____     /  __/ ____  / /                       \n';
		software+='         / /|_/ / __ |/ __ |/ __ `/ __ |    |__| / __  |/ /                        \n';
		software+='        / /  / / /_/ / / / / /_/ / /_/ /   ___/ / /  / / /___                      \n';
		software+='       /_/  /_/|____/_/ /_/|__, /|____/   /___ /|___| |_____/                      \n';
		software+='                          /____/                     |_|                           \n';
		software+='                                                                                   \n';
		software+='       Copyright(c) 2016, weiguoxing | version: v.1.0                              \n';

	log(software);
	
	//window.table=table;
	Mongo.DB.prototype.table=table;
	Mongo.DBQuery.prototype.table = table;
    Mongo.DBCommandCursor.prototype.table = table;
    
}({DB:DB,DBQuery:DBQuery,DBCommandCursor:DBCommandCursor});


/**
 * Run SQL on Mongo 
 * 
 * SQL
 * 
 * var sql='select a,b,c,sum(a),count(b),distinct a from table where a=1 and b=1 group by a,c order by b,a limit 0,10';**
 *
 * db.SQL("select pt_ip,pt_service,pt_code,pt_date,pt_user,pt_count from analysis_day limit 0,10 ");
 * db.SQL("select pt_user,count(pt_count) from analysis_day group by pt_user limit 0,10 ");
 * 
 */
+function(Mongo){

	/**
	 * 
	 * 解析SQL语句,解析结果保存到sqlParse对象中
	 * 
	 * @param {String} sql
	 * @return {Object} sqlParse
	 * 
	 * @descript:analysis sql to sqlParse
	 **/
	function parseSQL(sql){
		var sqlParse={};
		
		// sql:select {} from {} where {} group by {} order by {} limit {};
		
		sql.trim().replace(/\s*(select|from|where|group by|order by|limit)\s+/ig,'}$&{').substring(1).concat('}')
				  .replace(/(select|from|where|group by|order by|limit)\s+{(.*?)}/ig,
				  			function(match,func,args){
							    sqlParse[func]=args;
							    return match;
							});
		return sqlParse;
	}
	
	
	
	/***
	 * 
	 * 转换sqlParse对象为MongoDB的格式的查询对象
	 * 
	 * @param  {Object} sqlParse
	 * @return {Object} MongoQuery
	 * 
	 * @descript:parse sqlParse to MongoDB's query object
	 **/
	function createQuery(sqlParse){
		
		// collection:要查询的集合
		var collect=sqlParse.from;
		
		// where:查询条件
		var query={};
		if(sqlParse['where']){
		    var where=sqlParse['where'];
		    query=parseWhere(where);
		}
		
		// select:待展示的列
		var project={_id:0};
		// metric:聚合操作
		var metric=null;
		// dstinct:去重
		var distinct=null;
		
		if(sqlParse['select']){
		    var fields=sqlParse['select'].split(',');
		    for(var i=0;i<fields.length;i++){
		        var field=fields[i];
		        if(field.search(/^(sum|avg|max|min|count)/ig)>-1){
		            metric={};
		            field.replace(/^(sum|avg|max|min|count)\((\S+?)\)/ig,function(match,func,args){
		                metric[func]=args;
		                return match;
		            });
		        }else if(field.search(/distinct/ig)>-1){
		            distinct=field.split(/\s/g)[1];
		        }else if(field.search(/\*/ig)>-1){
		        	project={_id:0};
		        }else{
		            project[field]=1;
		        }
		    }
		}
		
		// sort
		var sort={};
		if(sqlParse['order by']){
		    var orders=sqlParse['order by'].split(',');
		    for(var i=0;i<orders.length;i++){
		        var field=orders[i];
		        var sort_type=field.split(/\s/g);    
		        sort[sort_type[0]]=sort_type[1]=='desc'?-1:1;
		    }
		}
		
		// limit
		var skip=null;
		var limit=null;
		if(sqlParse['limit']){
		    var limits=sqlParse['limit'].split(',');
		    skip=parseInt(limits[0].trim());
		    limit=parseInt(limits[1].trim());
		}
		
		
		// group
		var group=null;
		if(sqlParse['group by']){
		    group={};
		    var groups=sqlParse['group by'].split(',');
		    
		    for(var i=0;i<groups.length;i++){
		        var field=groups[i];
		        group[field]=field;
		    }
		}
		 
		// Mongo Query Object 
		var MongoQuery={
		    collect:collect,
		    query:query,
		    project:project,
		    sort:sort,
		    group:group,
		    metric:metric,
		    skip:skip,
		    limit:limit
		}
	
		//log(Mongo);
		
		return MongoQuery;
	}
	
	// 解析where语句
	function parseWhere(str){
		
		var config={
				'=':':',
		        '!=':'$ne',
		        '>':'$gt',
		        '>=':'$gte',
		        '<':'$lt',
		        '<=':'$lte',
		        'like':'$regex'
		}
		function parseObj(str){
			var res={};
			str.replace(/(['|"]*\w+['|"]*)(=|!=|>|<|>=|<=|like)(['|"]*\S+['|"]*)/ig,function(match,v1,opt,v2){
				v2=parseVal(v2);
				if(opt!='='){
					res[v1]={};
					res[v1][config[opt]]=v2;
				}else{
					res[v1]=v2;
				}
			});
			return res;
		}
		function parseVal(str){
			if((str.startsWith('"')&&str.endsWith('"'))||(str.startsWith("'")&&str.endsWith("'"))){
				return str.substring(1,str.length-1);
			}else{
				return parseInt(str);
			}
		}
		function where(str){
			// 预处理字符
			var arry=str.replace(/&&|\|\|/ig,function(match){
				return match=='&&'?'and':'or';    // 替换&&和||为and和or
			}).replace(/\(|\)/ig,function(match){
				return ' '+match+' ';             // 括弧两边添加空格
			}).replace(/\s*(>=|<=|=|!=|<|>|like)\s*/ig,function(match){	
				return match.trim();              // 剔除掉>=,<=,=,!=,<,>这些操作符两边的空格
			}).trim().split(/\s+/ig);             // 空格分隔串
			
			// input:"(a >=1 and b <= 1) or d=1" 
			//output:["(", "a>=1", "and", "b<=1", ")", "or", "d=1"]
			//console.info(arry);
			
			// 构造双栈结构解析字符串
			var vals=[]; // 操作数
			var opts=[]; // 操作符
			
			var opt_old=null;
			for(var i=0;i<arry.length;i++){
				var it=arry[i];
				if(it=='and'||it=='or'){
					opts.push(it);
				}else if(it=='('){
					
				}else if(it==')'){
					var opt=opts.pop();
					var v1=vals.pop();
					var v2=vals.pop();
					var v={};
					if(opt_old!=opt){
						v['$'+opt]=[v1,v2];
					}else{
						v1['$'+opt].push(v2);v=v1;
					}
					opt_old=opt;
					vals.push(v);
				}else{
					vals.push(parseObj(it));
				}
			}
			
			//console.info(vals);
			//console.info(opts);
			
			// 反转opts和vals
			opts.reverse();
			vals.reverse();
			
			var opt_old=null;
			// 从左至右解析表达式
			while(opts.length>0){
				var opt=opts.pop();
				var v1=vals.pop();
				var v2=vals.pop();
				var v={};
				if(opt_old!=opt){
					v['$'+opt]=[v1,v2];
				}else{
					v1['$'+opt].push(v2);v=v1;
				}
				opt_old=opt;
				vals.push(v);
			}
			var res=vals.pop();
			//console.info(res);
			return res;
		}
		return where(str);
	}

	/**
	 * 执行查询命令
	 * run query on mongo
	 * @param {Object} Query
	 */
	function runQuery(Query){
		
		var result=null;
		// Run Query
		if(!Query['group']&&!Query['metric']){
		    result=db[Query.collect].find(Query.query,Query.project).sort(Query.sort).limit(Query.limit).skip(Query.skip);
		}else{
		  
		    // clear date
		    db.tmp.remove({});
		    var mongo=JSON.stringify(Query);
		    var func='';
		        func+='var Query='+mongo+';\n';
		        func+='var key={};\n';
		        func+='var keys=Query.group==null?Query.project:Query.group;\n';
		        func+='for(var i in keys){if(keys[i]!==0) key[i]=this[i];};\n';
		        func+='var metric=Query.metric;\n';
		        func+='var msum=this[metric.sum]==undefined?0:this[metric.sum];\n';
		        func+='var mmin=this[metric.min]==undefined?0:this[metric.min];\n';
		        func+='var mmax=this[metric.max]==undefined?0:this[metric.max];\n';
		        func+='emit(key,{msum:msum,mcount:1,mmin:mmin,mmax:mmax});\n';
		
		    var map=new Function(func);
		    db.runCommand({
		        mapreduce:Query.collect,
		        query:Query.query,
		        map:map,
		        sort:Query.sort,
		        reduce:function(key,vals){
		            var ret={msum:0,mcount:0,mmin:0,mmax:0};
		            for(var i=0; i<vals.length;i++) {
		                ret.msum+=vals[i].msum;
		                ret.mcount+=vals[i].mcount;
		                if(vals[i].mmin<=ret.mmin)
		                    ret.mmin=vals[i].mmin;
		                if(vals[i].mmax>ret.mmax)
		                    ret.mmax=vals[i].mmax;
		            }
		            return ret;
		        },
		        finalize:function(key,val) {
		            val.mavg=val.msum/val.mcount;
		            return val;
		        },
		        out: {merge:'tmp'},
		        verbose:true
		    });
		   
		    var size=db.tmp.find({}).count();
		    var iterator=db.tmp.find({}).forEach(function(doc){
		        var res={};
		        for(var i in doc['_id']){
		            res[i]=doc['_id'][i];
		        }
		        for(var i in doc['value']){
		            res[i]=doc['value'][i];
		        }
		        res['res']=1;
		        db.tmp.insert(res);
		    });
		    
		    var project=Query.project;
		    for(var i in Query.metric){
		    	project['m'+i]=1;
		    }
		    //printjson(project);
		    flag=false;
		    result=db.tmp.find({res:1},project).sort(Query.sort).skip(Query.skip).limit(Query.limit);
		}
		
		return result;
	}

	/**
	 * 用于日志输出
	 * just for print log
	 * 
	 * @param {Object} lg
	 * 
	 */
	function log(lg){
		//console.info(lg);
		print(lg);
	}
	/**
	 * 主体SQL
	 * @param {Object} sql
	 */
	function SQL(sql){
		// Parse SQL
		var parse=parseSQL(sql);
		// Create Query Object
		var query=createQuery(parse);
		//Run Query
		var result=runQuery(query);
		// Print Result
		result.table();
	}
		
	// Export SQL Moduel
	Mongo.DB.prototype.SQL=SQL;
	Mongo.DBQuery.prototype.SQL = SQL;
	Mongo.DBCommandCursor.prototype.SQL = SQL;
	
}({DB:DB,DBQuery:DBQuery,DBCommandCursor:DBCommandCursor});