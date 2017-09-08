#ifndef H_OBJECT
#define H_OBJECT

#include <string>

typedef std::string String;
typedef int Number;
typedef bool Bool;


class Object {
    public:
        Object(const String &type): mb_type(type), mb_id(Object::GenId()){}
        ~Object(){};
         
        String GetID(void){ return mb_id; }
	void SetID(const String &id){ mb_id = id;}

        String GetType(void) const { return mb_type; }
         

    protected:
        static String GenId(void){ return String("UNIMPLEMENTED");}
        String mb_type;
        String mb_id;



};

#endif
