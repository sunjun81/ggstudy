import java.io.File

import scala.collection.concurrent.RDCSS_Descriptor

/**
 * Created with IntelliJ IDEA.
 * User: rick
 * Date: 6/23/14
 * Time: 3:42 PM
 *
 */
object FileMatcher {
  private def filesHere = (new File(".").listFiles())

  def filesEnding(query : String) : Array[File] =
//    for (file <- filesHere ; if file.getName.endsWith(query))
//      yield file
    filesMatching(_.endsWith(query))


  def filesContaining(query : String) : Array[File]  =
//    for (file <- filesHere ; if file.getName.contains(query))
//      yield file
    filesMatching(_.contains(query))

  def filesMatching(matcher : (String) => Boolean)
      : Array[File] =
    for (file <- filesHere ; if matcher(file.getName))
      yield file
}
