
#ifndef ISERIALIZABLE_H
#define ISERIALIZABLE_H




#include <string>
typedef std::string string;




class Serializable {
public:
     virtual string Serialize(void) const = 0;
     virtual void Deserialize(const &) = 0;

};
#endif
