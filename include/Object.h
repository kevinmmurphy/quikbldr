#ifndef H_OBJECT
#define H_OBJECT


#include <string>

using std::string;

class Object {
    public:
        Object(const string &type): mb_type(type), mb_id(Object::GenId()){}
        ~Object(){};
         
        std::string GetID(void){ return mb_id; }
	void SetID(const std::string &id){ mb_id = id;}

        std::string GetType(void) const { return mb_type; }
         

    protected:
        static string GenId(void){ return std::string("UNIMPLEMENTED");}
        string mb_type;
        string mb_id;



};

#endif
