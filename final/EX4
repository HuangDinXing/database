#include <iostream>
#include <string>
using namespace std;
class Fueltank
{
private:
    int m_FueltankCapacity;
    int m_Gas_grade;

public:
    Fueltank(int FueltankCapacity = 3000, int Gas = 98)
    {
        m_FueltankCapacity = FueltankCapacity;
        m_Gas_grade = Gas;
    }
    void fuel_up(int v, int gas)
    {
        if (gas != m_Gas_grade)
        {
            cout << "Error : Gas_grade : " << gas << " Correct Gas_grade: " << m_Gas_grade << endl;
        }
        if (v > m_FueltankCapacity)
        {
            cout << "Error : FueltankCapacity : " << m_FueltankCapacity << " but fuel up: " << v << endl;
        }

        m_FueltankCapacity += v;
        cout << "fuel up: " << v << " Gas_grade: " << gas << endl;

        // if ((gas == m_Gas_grade) && (v <= m_FueltankCapacity))
        // {
        //     m_FueltankCapacity += v;
        //     cout << "fuel up: " << v << " Gas_grade: " << gas << endl;
        // }
    }
    void set_Gas_grade(int Gas_grade)
    {
        m_Gas_grade = Gas_grade;
        cout << "Set Gas_grade: " << Gas_grade << endl;
    }
    int get_Gas_grade()
    {
        return m_Gas_grade;
    }
};
class Car
{
protected:
    string m_DriveMode;
    Fueltank m_Fueltank;

private:
    int m_Maxseating;
    int m_price;
    void m_UpdatePrice(int bace = 50000)
    {
        m_price = m_Maxseating * bace;
    }

public:
    string m_brand;
    string m_modle;
    int m_year;

    Car(string x, string y, int z, int s)
    {
        m_brand = x;
        m_modle = y;
        m_year = z;
        m_Maxseating = s;
        m_UpdatePrice();
        m_DriveMode = "No-wheel";
    }
    int Get_m_Maxseating()
    {
        return m_Maxseating;
    }
    int Get_Price()
    {
        return m_price;
    }
    string get_DriveMode()
    {
        return m_DriveMode;
    }
    string get_brand()
    {
        return m_brand;
    }
    int fuel_up(int v, int gas = 98)
    {
        m_Fueltank.fuel_up(v, gas);
        return 0;
    }
    int set_Gas_grade(int gas = 98)
    {
        m_Fueltank.set_Gas_grade(gas);
        return 0;
    }
    int get_Gas_grade()
    {
        return m_Fueltank.get_Gas_grade();
    }
};

class BMW_Car : public Car
{
private:
public:
    BMW_Car(string y, int z, int s) : Car("BMW", y, z, s)
    {
        cout << "Constructing BMW_Car\n";
        m_DriveMode = "Rear-wheel";
    }
    string get_DriveMode()
    {
        return m_DriveMode;
    }
};

class AUDI_Car : public Car
{
private:
public:
    AUDI_Car(string y, int z, int s) : Car("AUDI", y, z, s)
    {
        cout << "Constructing AUDI_Car\n";
        m_DriveMode = "Front-wheel";
    }
    string get_DriveMode()
    {
        return m_DriveMode;
    }
};

class BENZ_Car : public Car
{
private:
public:
    BENZ_Car(string y, int z, int s) : Car("BENZ", y, z, s)
    {
        cout << "Constructing BENZ_Car\n";
        m_DriveMode = "Front-wheel";
    }
    string get_DriveMode()
    {
        return m_DriveMode;
    }
};

int main()
{
    AUDI_Car car_2("A1", 2021, 2);
    cout << car_2.get_brand() << " : Gas_grade = " << car_2.get_Gas_grade() << endl;
    car_2.set_Gas_grade(95);
    cout << car_2.get_brand() << " : Gas_grade = " << car_2.get_Gas_grade() << endl;

    // car_2.fuel_up(300, 95);
    //  fuel up: 300 Gas_grade: 95

    // car_2.fuel_up(300, 99);
    //  Error : Gas_grade : 99 Correct Gas_grade: 95

    car_2.fuel_up(300000000, 95);
    //    Error : FueltankCapacity : 3000 but fuel up:300000000

    // car_2.fuel_up(300000000, 99);
    //  Error : Gas_grade : 99 Correct Gas_grade: 95
    //  Error : FueltankCapacity : 3000 but fuel up:300000000
    return 0;
}
