#ifndef H_OBJECT
#define H_OBJECT


#include <string>

using std::string;

class Object {
    public:
        Object(string &type): mb_type(type), mb_id(Object::GenId()){}
        ~Object();
         
        std::string GetID(void){ return mb_id; }
	void SetID(std::string &id){ mb_id = id;}

        std::string GetType(void){ return mb_type; }
         

    private:
        static string GenId(void){ return std::string("UNIMPLEMENTED");}
        string mb_type;
        string mb_id;



}

#endif
