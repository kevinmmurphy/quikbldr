#ifndef H_ISTORABLE
#define H_ISTORABLE

#include "ISerializable.h"
#include "Storage.h"
#include <list>



template <class T>
class IStorable {
    public:
        virtual bool DBExists(void);
        virtual int  DBCreate(void);
        virtual int  DBUpdate(void);
        virtual int  DBDelete(void); 
        std::list<T> DBFind(void);
}; 

#endif
