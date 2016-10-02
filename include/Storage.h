#ifndef H_STORAGE
#define H_STORAGE

#include <string>
#include <list>
#include "ISerializable.h"
#include "Singleton.hpp"

enum StorageErrors {
    NOERROR,
    ALREADYEXISTS
};

class StorageBase : public Singleton<StorageBase> 
{
    public:
        int Exists(const std::string &type, const std::string &id);
        int Load(const std::string &type, const std::string &id, std::string &obj);
        int Store(const std::string &type, const std::string &obj);
        int Delete(const std::string &type, const std::string &id);
        int Find(const std::string &type, const std::string &search, const std::list<std::string> &found);
        
};

template <class T>
class Storage 
{
    public:
       int Create(const T &obj){
          int retval = ALREADYEXISTS;
          if (!m_base.Exists(obj.GetType(), obj.GetId())){
              retval = m_base.Store(obj.GetType(), obj.Serialize());
          }
          return retval;
       }
 
       int Update(const T &obj){
          return m_base.Store(obj.GetType(), obj.Serialize());
       }

       int Delete(const T &obj){
          return  m_base.Delete(obj.GetType(), obj.GetId());
       }

       int Find(const T &obj, std::list<T> &found){
          int retval = NOERROR;
          std::list<std::string> sfound;
          retval = m_base.Find(obj.GetType(), obj.Serialize(), found); 
          for(std::string s : found)
          {
               T f;
               f.Deserialize(s);
               found.pushback(f);
          }
          return retval;
       }

    private:
       StorageBase m_base;
};

#endif
