import scala.io.Source

/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/23/14
 * Time: 1:26 PM
 *
 */
object LongLines {

  def processFile(filename : String,width : Int){

    def processLine(filename: String, width: Int, line: String) = {
      if (line.length > width)
        println(filename + ": " + line.trim)
    }

    val source = Source.fromFile(filename)
    for (line <- source.getLines())
      processLine(filename,width,line)
  }

  def main(args : Array[String]){
    val width = args(0).toInt
    for (arg <- args.drop(1))
      LongLines.processFile(arg,width)
  }

}
