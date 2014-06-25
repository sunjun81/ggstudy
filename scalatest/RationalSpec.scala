/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/20/14
 * Time: 11:12 AM
 *
 */

import org.scalatest.{FunSpec, BeforeAndAfter}

class RationalSpec extends FunSpec with BeforeAndAfter{

  var r1 : Rational = _
  var r2 : Rational = _

  before(
    r1 = new Rational(3,5),
    r2 = new Rational(1,2)
  )

  describe("RationalSpec"){
    it("add"){
      val s1 = r1.add(r2).toString()
      assert(s1 === "11/10")
      println("add done.")
    }

    it("lessThan"){
      val b = r2.lessThan(r1)
      println(b)
      assert(b)
      println("lessThan done.")
    }

    it("max"){
      assert(r1.max(r2) === r1);
      println("max done.")
    }

    //最大公约数
    it("gcd"){
      val r3 = new Rational(2,4)
      println(r3.number)
      println(r3.denom)
      assert(r2.equals(r3))
      println("gcd done.")
    }

    it("equal"){
      val r3 = new Rational(2,4)
      println(r3)
      assert(r2 === r3)
      println("equal done.")
    }

    it ("*"){
      val r4 = new Rational(3,10)
      assert(r4 === r1*r2)
      println("* done.")
    }

    it ("implicit"){
      assert(r2 * 2  === new Rational(1))
      println("implicit done.")
    }
  }


}
