const fs = require('fs');

function appendFileToDest(src, dest){
    let red = fs.readFileSync(src);
    fs.appendFileSync(dest, red);
}


function createLibInclude(model){

   let filename = './src/objs/headers/Objects.h';
   let classes = model.Classes;
   const file = fs.createWriteStream(filename);	
   file.on('open', function(fd) { 
		fs.appendFileSync (fd, `#include "Object.h"\n`);
		for (let i = 0; i < classes.length; i++){
			let srcfile = `./src/objs/cpp/${classes[i].Type}.h`;
			console.log(`Appending file ${srcfile} to export header.\n`);
			appendFileToDest(srcfile, fd);
		}
   });
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
		fs.appendFileSync (fd, `#ifndef _${objType}_\n#define _${objType}_\n`);
		//
		// inheritance includes
		// 
		fs.appendFileSync (filename, '#include "Object.h"\n');
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (fd, `#include "I${objAdjectives[i]}.h"\n`);
		}
		//
		// start class
		//
		fs.appendFileSync (fd, `\n\nclass ${objType}: public Object`);
		//
		// inheritance
		// 
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (fd, `, public I${objAdjectives[i]}`);
		}

		fs.appendFileSync (fd, '{\n    public:\n');
		//
		// Define constructor 
		// 
		fs.appendFileSync (fd, `        ${objType}();\n\n`);
		// 
		// write out seters and getters
		//
		for (var i = 0; i < memLength; i++) {
			const member = objMembers[i];
			fs.appendFileSync (fd, `        void  Set${member.Name}(const ${member.Type} &arg){ m_${member.Name} = arg; }\n`);
			fs.appendFileSync (fd, `        ${member.Type} Get${member.Name}(void){ return m_${member.Name};}\n\n`);

		}
		//
		// interface methods 
		// 
		fs.appendFileSync (fd, '\n');
		for (var i = 0; i < adjLength; i++) {
			if (objAdjectives[i] === 'Serializable') {
				fs.appendFileSync (fd, '        virtual std::string Serialize(void) const;\n'); 
				fs.appendFileSync (fd, '        virtual void Deserialize(const std::string &json);\n\n'); 
			}
			if (objAdjectives[i] === 'Storable') {
			  fs.appendFileSync (fd, '        bool DBExists(void);\n');
			  fs.appendFileSync (fd, '        int  DBCreate(void);\n');
			  fs.appendFileSync (fd, '        void DBUpdate(void);\n');
			  fs.appendFileSync (fd, '        void DBDelete(void);\n');
			  //fs.appendFileSync (fd, `        std::list<${objType}> DBFind(void);\n`);
			}
		}
		//
		//write out private 
		//
		fs.appendFileSync (fd, '    private:\n'); 
		//
		// data members
		//
		for (var i = 0; i < memLength; i++) {
			const member = objMembers[i];
			fs.appendFileSync (fd, `        ${member.Type} m_${member.Name};\n`);
		}
		//
		// close class
		//
		fs.appendFileSync (fd, '};\n');
		fs.appendFileSync (fd, '#endif\n');
	});
    

};



function createImplementation(classobj){
    var objType = classobj.Type;
    const filename = `./src/objs/cpp/${objType}.cpp`;
    const file = fs.createWriteStream(filename);		
	
	file.on('open', function(fd) {
		
		fs.appendFileSync (fd, `\n#include "${objType}.h"\n\n`);

		const objAdjectives = classobj.Adjectives;
		var adjLength = objAdjectives.length;
		const objMembers = classobj.Members;
		var memLength = objMembers.length;
		//
		// object constructor
		//
		fs.appendFileSync (fd, `${objType}::${objType}(): `); 
		fs.appendFileSync (fd, `Object(std::string("${objType}"))`);
		for (var i = 0; i < adjLength; i++) {
			fs.appendFileSync (fd, `, I${objAdjectives[i]}()`);
		}
		//
		// object constructor body
		//
		fs.appendFileSync (fd, '{\n');
		for (var j = 0; j < memLength; j++) {
			var member = objMembers[j];
			if (member.hasOwnProperty('DefaultVal'))
			{
				if (member.Type === 'String'){
					fs.appendFileSync (fd, `    m_${member.Name} = String(\"${member.DefaultVal}\");\n`);
				}
				else {
					fs.appendFileSync (fd, `    m_${member.Name} = ${member.DefaultVal};\n`);
				}
			}
		}
		fs.appendFileSync (fd, '}\n\n');
		//
		// Interface implementaions
		//
		for (var i = 0; i < adjLength; i++) {
			//
			// ISerializable
			//
			if (objAdjectives[i] === 'Serializable') {
				fs.appendFileSync (fd, `std::string ${objType}::Serialize(void) const {\n`);
				fs.appendFileSync (fd, '    std::ostringstream out;\n');
				fs.appendFileSync (fd, '    out << "{";\n');
				fs.appendFileSync (fd, `    out << "\\\"Type\\\":\\\"" << mb_type <<  "\\\",";\n`);
				fs.appendFileSync (fd, '    out << "\\\"Id\\\":\\\""   << mb_id   <<  "\\\"";\n');
				for (var j = 0; j < memLength; j++) {
					var member = objMembers[j];
					if (member.Type === 'String'){
			   fs.appendFileSync (fd, `    out << ",\\\"${member.Name}\\\":\\\"" << m_${member.Name} << "\\\"";\n`);
					}
					if (member.Type === 'Number'){
			   fs.appendFileSync (fd, `    out << ",\\\"${member.Name}\\\":\" << m_${member.Name} << "";\n`);
					}
					if (member.Type === 'Bool'){
			   fs.appendFileSync (fd, `    out << ",\\\"${member.Name}\\\":\" << m_${member.Name} << \"";\n`);
					}
			}
				fs.appendFileSync (fd, '    out << "}";\n');
				fs.appendFileSync (fd, '    return out.str();\n');
				fs.appendFileSync (fd, '}\n');
				fs.appendFileSync (fd, `void ${objType}::Deserialize(const std::string &in){\n`);
				fs.appendFileSync (fd, '    Json::Value root;\n    Json::Reader reader;\n    bool bParsed = reader.parse(in, root);\n');
				fs.appendFileSync (fd, '    if(!bParsed){ throw; }\n');
				fs.appendFileSync (fd, '    mb_type = root.get("Type", "").asString();\n');
				fs.appendFileSync (fd, '    mb_id   = root.get("Id", "").asString();\n');
				for (var j = 0; j < memLength; j++) {
					var member = objMembers[j];
					if (member.Type === 'String'){
			   fs.appendFileSync (fd, `    m_${member.Name} = root.get("${member.Name}","").asString();\n`);
					}
					if (member.Type === 'Number'){
			   fs.appendFileSync (fd, `    m_${member.Name} = root.get("${member.Name}","").asInt();\n`);
					}
					if (member.Type === 'Bool'){
			   fs.appendFileSync (fd, `    m_${member.Name} = root.get("${member.Name}","").asBool();\n`);
					}
			}
				fs.appendFileSync (fd, '}\n');
			}
		}
	});
};

function createManager(classobj){
	var objType = classobj.Type;
	//
	// Create header
	//
	
    //
	// Create Implementation
	//
	const filename = `./src/srv/cpp/${objType}Mgr.cpp`;
    const file = fs.createWriteStream(filename);		
	file.on('open', function(fd) {
		//
		// Include header
		//
		fs.appendFileSync (fd, `\n#include "${objType}Mgr.h"\n\n`);
	});
};

function createMsgProcessor(model){
	let classes = model.Classes;
	//
	// create header file
	//
	const headername = "./src/srv/cpp/MsgProcessor.h"
	const header = fs.createWriteStream(headername);
	header.on('open', function(fd) {
		fs.appendFileSync (fd, '\n#ifndef _MSGPROCSR_\n#define _MSGPROCSR_\n');
		fs.appendFileSync (fd, `\n#include "SocketInfo.h"\n`);
		fs.appendFileSync (fd, `class MsgProcessor: public IObjectEventReceiver<SocketInfo> {\n`);
		fs.appendFileSync (fd, "    public:\n");
		fs.appendFileSync (fd, "        MsgProcessor(ObjectEventSender<SocketInfo> *sender);\n");
		fs.appendFileSync (fd, "        ~MsgProcessor();\n");
		fs.appendFileSync (fd, "        OnObjectEvent(int e, const &object);\n");
		fs.appendFileSync (fd, "    private:\n");
		fs.appendFileSync (fd, "        ObjectEventSender<SocketInfo> *m_psender;\n");
		fs.appendFileSync (fd, `\n}\n`);
		fs.appendFileSync (fd, '#endif\n');
	});
	//
	// create Implementation
	//
    const filename = "./src/srv/cpp/MsgProcessor.cpp";
    const file = fs.createWriteStream(filename);		
	file.on('open', function(fd) {

		fs.appendFileSync (fd, `\n#include "MsgProcessor.h"\n\n`);
		for (let i = 0; i < classes.length; i++){
			//
			// Include manager class headers
			//
			fs.appendFileSync (fd, `\n#include "${classes[i].Type}Mgr.h"`);
	    }
		//
		// Implement Constructor
		//
		fs.appendFileSync (fd, `\n\nvoid MsgProcessor::MsgProcessor(ObjectEventSender<SocketInfo> *sender) : m_sender(sender){\n`);
		fs.appendFileSync (fd, `    m_sender->RegisterForObjectEvents(this);\n`);
		fs.appendFileSync (fd, `\n}\n\n`);
		//
		// Implement Destructor
		//
		fs.appendFileSync (fd, `\n\nvoid MsgProcessor::~MsgProcessor(){\n`);
		fs.appendFileSync (fd, `    m_sender->UnregisterForObjectEvents(this);\n`);
		fs.appendFileSync (fd, `\n}\n\n`);
		//
		// Implement OnObjectEvent
		//
		fs.appendFileSync (fd, `\n\nvoid MsgProcessor::OnObjectEvent(int e, buffer){\n`);
		fs.appendFileSync (fd, `\n}\n\n`);
	});
};





module.exports = {
    createModel: function(objects){
        console.log('Creating library include');
        createLibInclude(objects);
		createMsgProcessor(objects);
    },
    createClass: function(classobj) {
		console.log('Creating headers.');
		createHeader(classobj);
        console.log('Creating implementation.');
        createImplementation(classobj);
		createManager(classobj);
    }
};
