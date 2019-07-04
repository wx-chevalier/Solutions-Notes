[![](https://i.postimg.cc/WzXsh0MX/image.png)](https://github.com/wx-chevalier/Backend-Series)

# Test Double

![](https://res.cloudinary.com/dhttas9u5/image/upload/test-doubles_bmkusn.jpg)

本部分主要介绍所谓的 Test Double 的概念，并且对其中容易被混用的 Mocks 与 Stubs 的概念进行一个阐述。在初期接触到的时候，很多人会把 Mock 对象与另一个单元测试中经常用到的 Stub 对象搞混掉。为了方便更好地理解，这里把所有的所谓的 Test Double 的概念进行一个说明。我们先来看一个常用的单元测试的用例：

```java
public class OrderEasyTester extends TestCase {
  private static String TALISKER = "Talisker";

  private MockControl warehouseControl;
  private Warehouse warehouseMock;

  public void setUp() {
    warehouseControl = MockControl.createControl(Warehouse.class);
    warehouseMock = (Warehouse) warehouseControl.getMock();
  }

  public void testFillingRemovesInventoryIfInStock() {
    //setup - data
    Order order = new Order(TALISKER, 50);

    //setup - expectations
    warehouseMock.hasInventory(TALISKER, 50);
    warehouseControl.setReturnValue(true);
    warehouseMock.remove(TALISKER, 50);
    warehouseControl.replay();

    //exercise
    order.fill(warehouseMock);

    //verify
    warehouseControl.verify();
    assertTrue(order.isFilled());
  }

  public void testFillingDoesNotRemoveIfNotEnoughInStock() {
    Order order = new Order(TALISKER, 51);

    warehouseMock.hasInventory(TALISKER, 51);
    warehouseControl.setReturnValue(false);
    warehouseControl.replay();

    order.fill((Warehouse) warehouseMock);

    assertFalse(order.isFilled());
    warehouseControl.verify();
  }
}
```

当我们进行单元测试的时候，我们会专注于软件中的一个小点，不过问题就是虽然我们只想进行一个单一模块的测试，但是不得不依赖于其他模块，就好像上面例子中的 warehouse。而在我提供的两种不同的测试用例的编写方案中，第一个是使用了真实的 warehouse 对象，而第二个使用了所谓的 mock 的 warehouse 对象，也意味着并不是一个真正的 warehouse。使用 Mock 对象也是一种常用的在测试中避免依赖真正的对象的方法，不过像这种在测试中不使用真正对象的方法也有很多。我们经常看到的类似的关联的名词会有：stub、mock、fake、dummy。本文中我是打算借鉴 Gerard Meszaros 的论述，可能并不是所有人都怎么描述，不过我觉得 Gerard Meszaros 说的不错。Gerard Meszaros 是用`Test Double`这个术语来称呼这一类用于替换真实对象的模拟对象。Gerard Meszaros 具体定义了以下几类 double:

- Dummy : 用于传递给调用者但是永远不会被真实使用的对象，通常它们只是用来填满参数列表。
- Fake : Fake 对象常常与类的实现一起起作用，但是只是为了让其他程序能够正常运行，譬如内存数据库就是一个很好的例子。
- Stubs : Stubs 通常用于在测试中提供封装好的响应，譬如有时候编程设定的并不会对所有的调用都进行响应。Stubs 也会记录下调用的记录，譬如一个 email gateway 就是一个很好的例子，它可以用来记录所有发送的信息或者它发送的信息的数目。简而言之，Stubs 一般是对一个真实对象的封装。
- Mocks : Mocks 也就是 Fowler 这篇文章讨论的重点，即是针对设定好的调用方法与需要响应的参数封装出合适的对象。

在上述这几种 doubles 中，只有 mocks 强调行为验证，其他的一般都是强调状态验证。为了更好地描述这种区别，我们会对上面的例子进行一些扩展。一般在真实对象不太好交互或者代码还没有写好的时候，我们会选择使用一个测试的 Double。譬如我们需要测试一个发送邮件的程序是不是能够在发送邮件的时候设定正确的顺序，而我们肯定不希望真的发邮件出去，这样会被打死的。因此我们会为我们的 email 系统来创建一个 test double。这里也是用例子来展示 mocks 与 stubs 区别的地方：

```java
public interface MailService {
  public void send (Message msg);
}
public class MailServiceStub implements MailService {
  private List<Message> messages = new ArrayList<Message>();
  public void send (Message msg) {
    messages.add(msg);
  }
  public int numberSent() {
    return messages.size();
  }
}
```

然后就可以进行状态验证了：

```java
class OrderStateTester...
  public void testOrderSendsMailIfUnfilled() {
    Order order = new Order(TALISKER, 51);
    MailServiceStub mailer = new MailServiceStub();
    order.setMailer(mailer);
    order.fill(warehouse);
    assertEquals(1, mailer.numberSent());
  }
```

当然这是一个非常简单的测试，我们并没有测试它是否发给了正确的人或者发出了正确的内容。而如果使用 Mock 的话写法就很不一样了：

```java
class OrderInteractionTester...
  public void testOrderSendsMailIfUnfilled() {
    Order order = new Order(TALISKER, 51);
    Mock warehouse = mock(Warehouse.class);
    Mock mailer = mock(MailService.class);
    order.setMailer((MailService) mailer.proxy());

    mailer.expects(once()).method("send");
    warehouse.expects(once()).method("hasInventory")
      .withAnyArguments()
      .will(returnValue(false));

    order.fill((Warehouse) warehouse.proxy());
  }
}
```

在两个例子中我们都是用了 test double 来替代真正的 mail 服务，不同的在于 stub 是用的状态验证而 mock 使用的是行为验证。如果要基于 stub 编写状态验证的方法，需要写一些额外的代码来进行验证。而 Mock 对象用的是行为验证，并不需要写太多的额外代码。

# 测试中 Fakes、Mocks 以及 Stubs 概念明晰

自动化测试中，我们常会使用一些经过简化的，行为与表现类似于生产环境下的对象的复制品。引入这样的复制品能够降低构建测试用例的复杂度，允许我们独立而解耦地测试某个模块，不再担心受到系统中其他部分的影响；这类型对象也就是所谓的 Test Double。实际上对于 Test Double 的定义与阐述也是见仁见智，Gerard Meszaros 在[这篇文章](http://xunitpatterns.com/Test%20Double.html)中就介绍了五个不同的 Double 类型；而人们更倾向于使用 Mock 来统一描述不同的 Test Doubles。不过对于 Test Doubles 实现的误解还是可能会影响到测试的设计，使测试用例变得混乱和脆弱，最终带来不必要的重构。本文则是从作者个人的角度描述了常见的 Test Doubles 类型及其具体的实现：Fake、Stub 与 Mock，并且给出了不同的 Double 的使用场景。

# Fake

> Fakes are objects that have working implementations, but not same as production one. Usually they take some shortcut and have simplified version of production code.
> Fake 是那些包含了生产环境下具体实现的简化版本的对象。

如下图所示，Fake 可以是某个 Data Access Object 或者 Repository 的基于内存的实现；该实现并不会真的去进行数据库操作，而是使用简单的 HashMap 来存放数据。这就允许了我们能够在并没有真的启动数据库或者执行耗时的外部请求的情况下进行服务的测试。

![](https://res.cloudinary.com/practicaldev/image/fetch/s--KVtUzSi6--/c_limit,f_auto,fl_progressive,q_auto,w_880/https://thepracticaldev.s3.amazonaws.com/i/8iym8jnai3zno15i5uvi.png)

```
@Profile("transient")
public class FakeAccountRepository implements AccountRepository {

   Map<User, Account> accounts = new HashMap<>();

   public FakeAccountRepository() {
       this.accounts.put(new User("john@bmail.com"), new UserAccount());
       this.accounts.put(new User("boby@bmail.com"), new AdminAccount());
   }

   String getPasswordHash(User user) {
       return accounts.get(user).getPasswordHash();
   }
}
```

除了应用到测试，Fake 还能够用于进行原型设计或者峰值模拟中；我们能够迅速地实现系统原型，并且基于内存存储来运行整个系统，推迟有关数据库设计所用到的一些决定。另一个常见的使用场景就是利用 Fake 来保证在测试环境下支付永远返回成功结果。

# Stub

> Stub is an object that holds predefined data and uses it to answer calls during tests. It is used when we cannot or don’t want to involve objects that would answer with real data or have undesirable side effects.
> Stub 代指那些包含了预定义好的数据并且在测试时返回给调用者的对象。Stub 常被用于我们不希望返回真实数据或者造成其他副作用的场景。

Stub 的典型应用场景即是当某个对象需要从数据库抓取数据时，我们并不需要真实地与数据库进行交互或者像 Fake 那样从内存中抓取数据，而是直接返回预定义好的数据。
![](https://res.cloudinary.com/practicaldev/image/fetch/s--teEfYNfN--/c_limit,f_auto,fl_progressive,q_auto,w_880/https://thepracticaldev.s3.amazonaws.com/i/2v592ht59ksiprwgzjzq.png)

```
public class GradesService {

   private final Gradebook gradebook;

   public GradesService(Gradebook gradebook) {
       this.gradebook = gradebook;
   }

   Double averageGrades(Student student) {
       return average(gradebook.gradesFor(student));
   }
}
```

我们在编写测试用例时并没有从 Gradebook 存储中抓取数据，而是在 Stub 中直接定义好需要返回的成绩列表；我们只需要足够的数据来保证对平均值计算函数进行测试就好了。

```
public class GradesServiceTest {

   private Student student;
   private Gradebook gradebook;

   @Before
   public void setUp() throws Exception {
       gradebook = mock(Gradebook.class);
       student = new Student();
   }

   @Test
   public void calculates_grades_average_for_student() {
       when(gradebook.gradesFor(student)).thenReturn(grades(8, 6, 10)); //stubbing gradebook

       double averageGrades = new GradesService(gradebook).averageGrades(student);

       assertThat(averageGrades).isEqualTo(8.0);
   }
}
```

# Command Query Separation

仅返回部分结果而并没有真实改变系统状态的的方法被称作查询(Query)。譬如 `avarangeGrades`，用于返回学生成绩平均值的函数就是非常典型的例子：`Double getAverageGrades(Student student);`。该函数仅返回了某个值，而没有其他的任何副作用。正如我们上文中介绍的，我们可以使用 Stubs 来替换提供实际成绩值的函数，从而简化了整个测试用例的编写。不过除了 Query 之外还有另一个类别的方法，被称作 Command。即当某个函数在执行某些操作的时候还改变了系统状态，不过该类型函数往往没有什么返回值：void sendReminderEmail(Student student);。这种对于方法的划分方式也就是 Bertrand Meyer 在 [Object Oriented Software Construction](https://www.amazon.com/Object-Oriented-Software-Construction-Book-CD-ROM/dp/0136291554) 一书中介绍的 Command Query 分割法。
对于 Query 类型的方法我们会优先考虑使用 Stub 来代替方法的返回值，而对于 Command 类型的方法的测试则需要依赖于 Mock。

# Mock

> Mocks are objects that register calls they receive. In test assertion we can verify on Mocks that all expected actions were performed.
> Mocks 代指那些仅记录它们的调用信息的对象，在测试断言中我们需要验证 Mocks 被进行了符合期望的调用。

当我们并不希望真的调用生产环境下的代码或者在测试中难于验证真实代码执行效果的时候，我们会用 Mock 来替代那些真实的对象。典型的例子即是对邮件发送服务的测试，我们并不希望每次进行测试的时候都发送一封邮件，毕竟我们很难去验证邮件是否真的被发出了或者被接收了。我们更多地关注于邮件服务是否按照我们的预期在合适的业务流中被调用，其概念如下图所示：
![](https://res.cloudinary.com/practicaldev/image/fetch/s--VOv4blDO--/c_limit,f_auto,fl_progressive,q_auto,w_880/https://thepracticaldev.s3.amazonaws.com/i/4axggbc9kiqrvl1fguju.png)

```
public class SecurityCentral {

   private final Window window;
   private final Door door;

   public SecurityCentral(Window window, Door door) {
       this.window = window;
       this.door = door;
   }

   void securityOn() {
       window.close();
       door.close();
   }
}
```

在上述代码中，我们并不想真的去关门来测试 securityOn 方法，因此我们可以设置合适的 Mock 对象：

```
public class SecurityCentralTest {

   Window windowMock = mock(Window.class);
   Door doorMock = mock(Door.class);

   @Test
   public void enabling_security_locks_windows_and_doors() {
       SecurityCentral securityCentral = new SecurityCentral(windowMock, doorMock);

       securityCentral.securityOn();

       verify(doorMock).close();
       verify(windowMock).close();
   }
}
```

在 `securityOn` 方法执行之后，window 与 door 的 Mock 对象已经记录了所有的交互信息，这就允许我们能够去验证 Window 与 Door 是否被真实的调用。或许有人会疑问是否在真实环境下门与窗是否被真的关闭了？其实我们并不能保证，不过这也不是我们关注的点，也不是 `SecurityCentral` 这个类关注的目标。门与窗是否能被正常的关闭应该是由 `Door` 与 `Window` 这两个类所关注的。
