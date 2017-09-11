#ifndef IOBSERVER_H
#define IOBSERVER_H


template<class T, class E = int> class IObjectEventReceiver
{
public:
	void FireObjectEvent(E event, const T &object){
	    static_cast<T*>(this)->OnObjectEvent(event, object);
	};
};

template<class T, class E = int> class ObjectEventSender
{
public:
	void RegisterForObjectEvents(IObjectEventReceiver<T> *receiver)
	{
		auto itr = std::find(m_ObjectListeners.begin(), m_ObjectListeners.end(), receiver);
		if (itr == m_ObjectListeners.end())
		{
			m_ObjectListeners.push_back(receiver);
		}
	};
	void UnregisterForObjectEvents(IObjectEventReceiver<T> *receiver)
	{
		auto itr = std::find(m_ObjectListeners.begin(), m_ObjectListeners.end(), receiver);
		if (itr != m_ObjectListeners.end())
		{
			m_ObjectListeners.erase(itr);
		}
	};
protected:
	void UpdateObjectEventReceivers(E event, const T &object)
	{
		for (auto itr = m_ObjectListeners.begin(); itr != m_ObjectListeners.end(); itr++)
		{
			(*itr)->OnObjectEvent(event, object);
		}
	};
private:
	std::vector<IObjectEventReceiver<T,E> *> m_ObjectListeners;
};


#endif