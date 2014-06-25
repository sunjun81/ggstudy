/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/18/14
 * Time: 11:38 AM
 *
 */

import java.util

import ChecksumAccumulator.calculate

object Hi {

  def main(args: Array[String]){
    val strs = new Array[String](4)
    strs(0) = "孙军"
    strs(1) = "Rick"
    strs(2) = "TechX2"
    strs(3) = "BU5"
    example1(strs)

    example2()

    example3()

    example4()

    example5()

    example6()

    example7()

    example8()

  }

  def splitMessage(){
    println("\n----------------")
  }

  def example1(strs : Array[String]){
    println("example1")
//    for (s <- strs)
//      println(s + ": " + calculate(s))

    strs.foreach((s:String) => println(s + ": " + calculate(s)))

    splitMessage()
  }

  def example2(){
    println("example2")
    println(0 max 5)
    println(0 min 5)
    println(-2.7 abs)
    println(-2.7 round)
    println(1.5 isInfinite)
    println(4 to 6)
    println("bool" capitalize)
    println("robert" drop 2)
    splitMessage()
  }

  /**
   * 分数类Rational的example
   */
  def example3(){
    val r1 = new Rational(1,3)
    println(r1.toString)

    //分母不能为0
    try {
      val r2 = new Rational(5,0)
      println(r2.toString)
    } catch {
      case ex : ArithmeticException => println(ex)
      case ex : IllegalArgumentException => println(ex + " denom couldn't be zero .")
      case _  => println("default error")
    }
  }

  def example4(){

    val odds =
    for (odd <- 0 to 100
      if odd % 2 != 0
    )
    yield odd

    println(odds)

    splitMessage()
  }

  def example5(){
    multiTable()

    splitMessage()
  }

  private def makeRowSeq(row : Int) =
    for (col <- 1 to 10) yield {
      val prod = (row * col ).toString
      val padding = " " * (4 - prod.length)
      padding + prod
    }

  private def makeRow(row : Int) = makeRowSeq(row).mkString

  private def multiTable() = {
    val tableSeq =
      for (row <- 1 to 10)
        yield makeRow(row)
    print(tableSeq.mkString("\n"))
  }

  def example6(){
    val numbers = List(-11,-10,-12,-5,0,5,2,10)
    val positiveAndEven = numbers.filter((p) => p >= 0 && p % 2 == 0)
    println(positiveAndEven)

    val list = List(1  ,2 , 3, 4, 5 ,6,3,3,-1)


    val line =list.aggregate((0,0))((x , y :Int) => {(x._1 + y  , x._2 + 2 )}
      , (x , y) => (x._1 + y._1 , x._2 + y._2 ) )
    println(line)
    splitMessage()
  }

  def example7() {
    def sum(a: Int,b : Int,c : Int) = a + b + c
    val a = sum _
    println(a(1,2,3))

    val b = sum(1, _ : Int,3)
    println(b(2))
  }

  def example8(){
    trait ForEachAble[A]{
      def iterator : java.util.Iterator[A]

      def foreach(f : A => Unit) = {
        val iter = iterator
        while (iter.hasNext)
          f(iter.next())
      }
    }

    trait JsonAble {
      def toJson() = scala.util.parsing.json.JSONFormat.defaultFormatter(this)
    }

    val list = new util.ArrayList[Int]() with ForEachAble[Int] with JsonAble
    for (i <- 1 to 10)
      list.add(i)

    println("for each : ")
    list.foreach(x => println(x))

    println("To Json : ")
    println(list.toJson())
  }

}
