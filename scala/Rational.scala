/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/20/14
 * Time: 10:36 AM
 *
 */

/**
 * 分数类
 * @param n 分子
 * @param d　分母
 */
class Rational(n : Int, d : Int) {
  require(d != 0)
  //最大公约数
  private val g = gcd(n.abs,d.abs)
  val number = n / g
  val denom  = d / g

  def this(n : Int) = this(n,1)

  println("Created " + number + "/" + denom)

  override def toString = number + "/" + denom

  /**
   * Add
   * @param that other Rational
   * @return
   */
  def add(that : Rational) : Rational = {
    new Rational(number * that.denom + denom * that.number,
                 denom * that.denom)
  }

  def +(that : Rational) : Rational = add(that)

  /**
   * 同分母相加
   * @param n 分子
   * @return
   */
  def +(n : Int) : Rational = {
    new Rational(number + n * denom , denom)
  }

  def -(that : Rational) : Rational = {
    new Rational(number * that.denom - denom * that.number,
                 denom * that.denom)
  }

  def -(n : Int) : Rational = {
    new Rational(number - n * denom ,denom)
  }

  def multiple(that : Rational) : Rational = {
    new Rational(number * that.number,denom * that.denom)
  }

  def *(that : Rational) : Rational = multiple(that)

  def *(x : Int) : Rational = new Rational(number * x,denom)

  /**
   *
   * @param that other Rational
   * @return
   */
  def lessThan(that : Rational) : Boolean = {
    this.number * that.denom < that.number * this.denom
  }

  /**
   *
   * @param that other Rational
   * @return
   */
  def max(that : Rational) : Rational = {
    if (this.lessThan(that))
      that
    else
      this
  }

  override def equals(obj: Any) : Boolean = {
    val r = asInstanceOf[Rational]
    this.number * r.denom == r.number * this.denom
  }

  implicit def intToRational(x : Int) : Rational = {
    new Rational(x)
  }

  /**
   * 最大公约数
   * @param a Int 1
   * @param b Int 2
   * @return
   */
  private def gcd(a : Int,b : Int) : Int = {
    if (b == 0) a else gcd(b,a % b)
  }

}
