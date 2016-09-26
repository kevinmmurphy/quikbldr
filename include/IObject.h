#ifndef H_OBJECT
#define H_OBJECT


#include <string>

typedef string std::string;

class Object {
    Public:
        Object(string &type): mb_type(type), mb_id(Object::GenId();}{}
        ~Object();
         
        std::string GetID(void){ return mb_id: }
	std::string SetID(std::string &id){ mb_id;}

        std::string GetType(void){ return mb_type; }
         

    Private:
        static string GenId(void){ return std::string("UNIMPLEMENTED");}
        string mb_type;
        string mb_id;



}

#endif
