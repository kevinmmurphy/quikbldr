#ifndef ISERIALIZABLE_H
#define ISERIALIZABLE_H

#include <string>
#include "json/json.h"


class ISerializable {
public:
     virtual std::string Serialize(void) const = 0;
     virtual void Deserialize(const std::string &) = 0;

};
#endif
