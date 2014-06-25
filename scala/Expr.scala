/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/25/14
 * Time: 9:37 AM
 *
 */
abstract class Expr

case class FibonacciExpr(n : Int) extends Expr{
  require(n >= 0)
}

case class SumExpr(a : Expr, b : Expr) extends Expr

def value(in : Expr) : Int = in match {
  case FibonacciExpr(0) => 0
  case FibonacciExpr(1) => 1
  case FibonacciExpr(n) => value(SumExpr(FibonacciExpr(n-1),FibonacciExpr(n-2)))
  case SumExpr(a,b) => value(a) + value(b)
  case _ => 0
}

println(value(FibonacciExpr(3)))
