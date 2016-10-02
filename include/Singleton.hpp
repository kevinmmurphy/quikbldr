#ifndef SINGLETON_HPP
#define SINGLETON_HPP 


template <typename T>
class Singleton
{
public:
    static T& Instance();

protected:
    virtual ~Singleton();
    inline explicit Singleton();

private:
    static T* _instance;
    static T* CreateInstance();
};

template<typename T>
T* Singleton<T>::_instance = 0;

template <typename T>
Singleton<T>::Singleton()
{
    assert(Singleton::_instance == 0);
    Singleton::_instance = static_cast<T*>(this);
}

template<typename T>
 T& Singleton<T>::Instance()
{
    if (Singleton::_instance == 0)
    {
        Singleton::_instance = CreateInstance();
    }
    return *(Singleton::_instance);
}

template<typename T>
inline T* Singleton<T>::CreateInstance()
{
    return new T();
}

template<typename T>
Singleton<T>::~Singleton()
{
    if(Singleton::_instance != 0)
    {
        delete Singleton::_instance;
    }
    Singleton::_instance = 0;
}
#endif // SINGLETON_H
