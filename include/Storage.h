#ifndef H_STORAGE
#define H_STORAGE

#include <string>
#include <list>
#include "ISerializable.h"
#include "Singlton.h"

class StorageBase : public Singleton 
{
    Public:
        int Exists(const std::string &type, const std::string &id);
        int Load(const std::string &type, const std::string &id, std::string &obj);
        int Store(const std::string &type, const std::string &obj);
        int Delete(const std::string &type, const std::string &id);
        int Find(const std::string &type, const std::string &search, const std::list<std::string> &found);
        
}


template <class T>
class Storage 
{
    Plublic:
       int Create(const T &obj){
          int retval = ALREADYEXISTS;
          if (!m_base.Exists(obj.GetType(), obj.GetId())(
              retval = e_base.Store(obj.GetType(), obj.Serialize());
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
          int retval = OK;
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

    Private:
       StorageBase m_base;
}

#endif
