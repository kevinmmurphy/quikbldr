#ifndef H_ILOCKABLE
#define H_ILOCKABLE
#include "Object.h"
#include "StringLock.h"


class ILockable : public Object {
    public:
       virtual void Lock(void);
       virtual void Unlock(void);

};


#endif
