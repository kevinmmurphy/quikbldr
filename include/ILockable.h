#ifndef H_ILOCKABLE
#define H_ILOCKABLE
#include "Object.h"
#include "StringLock.h"


class ILockable : public Object {
    Public:
       virtual void Lock(void);
       virtual void Unlock(void);

}


#endif
