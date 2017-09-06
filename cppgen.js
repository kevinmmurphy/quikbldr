const fs = require('fs');

function appendFileToDest(src, dest){
    let red = fs.readFileSync(src);
    fs.appendFileSync(dest, red);
}


function createLibInclude(model){

   let filename = './src/objs/headers/Objects.h';
   let classes = model.Classes;
   const file = fs.createWriteStream(filename);		
   for (let i = 0; i < classes.length; i++){
      let srcfile = `./src/objs/cpp/${classes[i].Type}.h`;
      console.log(`Appending file ${srcfile} to export header.\n`);
      appendFileToDest(srcfile, filename);
   }
};

function createHeader(classobj){
    var objType = classobj.Type;
    var objMembers = classobj.Members;
    const memLength = objMembers.length;
    const objAdjectives = classobj.Adjectives;
    const adjLength = objAdjectives.length;
    const filename = `./src/objs/cpp/${objType}.h`;
    const file = fs.createWriteStream(filename);	

    file.on('open', function(fd) {
		fs.appendFileSync (filename, `#ifndef _${objType}_\n#define _${objType}_\n`);
		//
		// inheritance includes
		// 
		fs.appendFileSync (filename, '#include "Object.h"\n');
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (filename, `#include "I${objAdjectives[i]}.h"\n`);
		}
		//
		// start class
		//
		fs.appendFileSync (filename, `\n\nclass ${objType}: public Object`);
		//
		// inheritance
		// 
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (filename, `, public I${objAdjectives[i]}`);
		}

		fs.appendFileSync (filename, '{\n    public:\n');
		//
		// Define constructor 
		// 
		fs.appendFileSync (filename, `        ${objType}();\n\n`);
		// 
		// write out seters and getters
		//
		for (var i = 0; i < memLength; i++) {
		const member = objMembers[i];
		fs.appendFileSync (filename, `        void  Set${member.Name}(const ${member.Type} &arg){ m_${member.Name} = arg; }\n`);
		fs.appendFileSync (filename, `        ${member.Type} Get${member.Name}(void){ return m_${member.Name};}\n\n`);

		}
		//
		// interface methods 
		// 
		fs.appendFileSync (filename, '\n');
		for (var i = 0; i < adjLength; i++) {
			if (objAdjectives[i] === 'Serializable') {
		  fs.appendFileSync (filename, '        virtual std::string Serialize(void) const;\n'); 
		  fs.appendFileSync (filename, '        virtual void Deserialize(const std::string &json);\n\n'); 
			}
			if (objAdjectives[i] === 'Storable') {
			  fs.appendFileSync (filename, '        bool DBExists(void);\n');
			  fs.appendFileSync (filename, '        int  DBCreate(void);\n');
			  fs.appendFileSync (filename, '        void DBUpdate(void);\n');
			  fs.appendFileSync (filename, '        void DBDelete(void);\n');
			  //fs.appendFileSync (filename, `        std::list<${objType}> DBFind(void);\n`);
			}
		}
		//
		//write out private 
		//
		fs.appendFileSync (filename, '    private:\n'); 
		//
		// setters and getters
		//
		for (var i = 0; i < memLength; i++) {
		const member = objMembers[i];
		fs.appendFileSync (filename, `        ${member.Type} m_${member.Name};\n`);

		}
		//
		// close class
		//
		fs.appendFileSync (filename, '};\n');
		fs.appendFileSync (filename, '#endif\n');
	});
    

};



function createImplementation(classobj){
    var objType = classobj.Type;
    const filename = `./src/objs/cpp/${objType}.cpp`;
    const file = fs.createWriteStream(filename);		
	
	file.on('open', function(fd) {
		
		fs.appendFileSync (filename, `\n#include "${objType}.h"\n\n`);

		const objAdjectives = classobj.Adjectives;
		var adjLength = objAdjectives.length;
		const objMembers = classobj.Members;
		var memLength = objMembers.length;
		//
		// object constructor
		//
		fs.appendFileSync (filename, `${objType}::${objType}(): `); 
		fs.appendFileSync (filename, `Object(std::string("${objType}"))`);
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (filename, `, I${objAdjectives[i]}()`);
		}
		fs.appendFileSync (filename, '{}\n\n');
		//
		// Interface implementaions
		//
		for (var i = 0; i < adjLength; i++) {
			//
			// ISerializable
			//
			if (objAdjectives[i] === 'Serializable') {
				fs.appendFileSync (filename, `std::string ${objType}::Serialize(void) const {\n`);
				fs.appendFileSync (filename, '    std::ostringstream out;\n');
				fs.appendFileSync (filename, '    out << "{";\n');
				fs.appendFileSync (filename, `    out << "\\\"Type\\\":\\\"" << mb_type <<  "\\\",";\n`);
				fs.appendFileSync (filename, '    out << "\\\"Id\\\":\\\""   << mb_id   <<  "\\\"";\n');
				for (var j = 0; j < memLength; j++) {
					var member = objMembers[j];
					if (member.Type === 'String'){
			   fs.appendFileSync (filename, `    out << ",\\\"${member.Name}\\\":\\\"" << m_${member.Name} << "\\\"";\n`);
					}
					if (member.Type === 'Number'){
			   fs.appendFileSync (filename, `    out << ",\\\"${member.Name}\\\":\" << m_${member.Name} << "";\n`);
					}
					if (member.Type === 'Bool'){
			   fs.appendFileSync (filename, `    out << ",\\\"${member.Name}\\\":\" << m_${member.Name} << \"";\n`);
					}
			}
				fs.appendFileSync (filename, '    out << "}";\n');
				fs.appendFileSync (filename, '    return out.str();\n');
				fs.appendFileSync (filename, '}\n');
				fs.appendFileSync (filename, `void ${objType}::Deserialize(const std::string &in){\n`);
				fs.appendFileSync (filename, '    Json::Value root;\n    Json::Reader reader;\n    bool bParsed = reader.parse(in, root);\n');
				fs.appendFileSync (filename, '    if(!bParsed){ throw; }\n');
				fs.appendFileSync (filename, '    mb_type = root.get("Type", "").asString();\n');
				fs.appendFileSync (filename, '    mb_id   = root.get("Id", "").asString();\n');
				for (var j = 0; j < memLength; j++) {
					var member = objMembers[j];
					if (member.Type === 'String'){
			   fs.appendFileSync (filename, `    m_${member.Name} = root.get("${member.Name}","").asString();\n`);
					}
					if (member.Type === 'Number'){
			   fs.appendFileSync (filename, `    m_${member.Name} = root.get("${member.Name}","").asInt();\n`);
					}
					if (member.Type === 'Bool'){
			   fs.appendFileSync (filename, `    m_${member.Name} = root.get("${member.Name}","").asBool();\n`);
					}
			}
				fs.appendFileSync (filename, '}\n');
			}
		}
	});
};

module.exports = {
    createModel: function(objects){
        console.log('Creating library include');
        createLibInclude(objects);
    },
    createClass: function(classobj) {
	console.log('Creating headers.');
	createHeader(classobj);
        console.log('Creating implementation.');
        createImplementation(classobj);
    }
};
